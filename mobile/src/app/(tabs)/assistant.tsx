import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio'
import * as Speech from 'expo-speech'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'
import { useLanguage } from '@/contexts/language-context'
import { useTheme } from '@/hooks/use-theme'
import { askAssistant, transcribeAudio } from '@/services/assistant'
import { RelatedStory } from '@/types/related-story'
import { pickTranslation } from '@/utils/translate'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  relatedStories?: RelatedStory[]
}

export default function AssistantScreen() {
  const theme = useTheme()
  const { language } = useLanguage()
  const insets = useSafeAreaInsets()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [transcribing, setTranscribing] = useState(false)
  const listRef = useRef<FlatList<Message>>(null)
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY)
  const recorderState = useAudioRecorderState(audioRecorder)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height)
    })
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0)
    })

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  useEffect(() => {
    return () => {
      Speech.stop()
    }
  }, [])

  function speakMessage(message: Message) {
    Speech.stop()
    setSpeakingId(message.id)
    Speech.speak(message.text, {
      language: 'fr-FR',
      onDone: () => setSpeakingId((current) => (current === message.id ? null : current)),
      onStopped: () => setSpeakingId((current) => (current === message.id ? null : current)),
      onError: () => setSpeakingId((current) => (current === message.id ? null : current)),
    })
  }

  function handleToggleSpeak(message: Message) {
    if (speakingId === message.id) {
      Speech.stop()
      setSpeakingId(null)
      return
    }
    speakMessage(message)
  }

  async function handleMicPressIn() {
    if (transcribing || recorderState.isRecording) return

    const { granted } = await AudioModule.requestRecordingPermissionsAsync()
    if (!granted) return

    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true })
    await audioRecorder.prepareToRecordAsync()
    audioRecorder.record()
  }

  async function handleMicPressOut() {
    if (!recorderState.isRecording) return
    await audioRecorder.stop()
    const uri = audioRecorder.uri
    if (!uri) return

    setTranscribing(true)
    try {
      const text = await transcribeAudio(uri)
      if (text.trim()) {
        await sendMessage(text)
      }
    } catch {
      // Silently ignore — the user can just retry the recording.
    } finally {
      setTranscribing(false)
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { id: `${Date.now()}-u`, role: 'user', text: trimmed }
    setMessages((current) => [...current, userMessage])
    setInput('')
    setLoading(true)

    try {
      const { answer, relatedStories } = await askAssistant(trimmed)
      const assistantMessage: Message = {
        id: `${Date.now()}-a`,
        role: 'assistant',
        text: answer,
        relatedStories,
      }
      setMessages((current) => [...current, assistantMessage])
      speakMessage(assistantMessage)
    } catch {
      const errorMessage: Message = {
        id: `${Date.now()}-e`,
        role: 'assistant',
        text: "Désolé, une erreur est survenue. Réessaie dans un instant.",
      }
      setMessages((current) => [...current, errorMessage])
      speakMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    await sendMessage(input)
  }

  const restingBottomPadding = insets.bottom + BottomTabInset + Spacing.four
  const activeBottomPadding = keyboardHeight + BottomTabInset + Spacing.four

  return (
    <ThemedView
      style={[
        styles.container,
        { paddingBottom: keyboardHeight > 0 ? activeBottomPadding : restingBottomPadding },
      ]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Assistant
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Pose une question sur les monuments de Marrakech
          </ThemedText>
        </View>
      </SafeAreaView>

      <View style={styles.flex}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.listContent}
          style={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View style={item.role === 'user' ? styles.messageGroupUser : styles.messageGroupAssistant}>
              <View
                style={[
                  styles.bubble,
                  item.role === 'user'
                    ? [styles.bubbleUser, { backgroundColor: theme.tint }]
                    : [
                        styles.bubbleAssistant,
                        { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                      ],
                ]}>
                <ThemedText type="small" style={item.role === 'user' ? styles.bubbleUserText : undefined}>
                  {item.text}
                </ThemedText>
                {item.role === 'assistant' && (
                  <Pressable
                    onPress={() => handleToggleSpeak(item)}
                    hitSlop={8}
                    style={styles.speakButton}>
                    <Ionicons
                      name={speakingId === item.id ? 'volume-mute-outline' : 'volume-high-outline'}
                      size={15}
                      color={theme.textSecondary}
                    />
                    <ThemedText type="small" themeColor="textSecondary" style={styles.speakLabel}>
                      {speakingId === item.id ? 'Arrêter' : 'Écouter'}
                    </ThemedText>
                  </Pressable>
                )}
              </View>

              {item.relatedStories?.map((story) => (
                <Pressable
                  key={story.id}
                  onPress={() => router.push({ pathname: '/story/[id]', params: { id: story.id } })}
                  style={[
                    styles.storyCard,
                    { backgroundColor: theme.backgroundElement, borderColor: theme.border },
                  ]}>
                  <Image source={{ uri: story.coverImageUrl }} style={styles.storyCardImage} contentFit="cover" />
                  <View style={styles.storyCardText}>
                    <ThemedText type="smallBold" numberOfLines={1}>
                      {pickTranslation(story.titleEn, story.titleFr, language)}
                    </ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
                      {pickTranslation(story.shortDescriptionEn, story.shortDescriptionFr, language)}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" color={theme.textSecondary} size={16} />
                </Pressable>
              ))}
            </View>
          )}
          ListEmptyComponent={
            <ThemedView style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" color={theme.textSecondary} size={32} />
              <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
                Demande-moi n&apos;importe quoi sur les histoires et monuments de Marrakech.
              </ThemedText>
            </ThemedView>
          }
        />

        {loading && (
          <View style={styles.typingRow}>
            <ActivityIndicator size="small" />
            <ThemedText type="small" themeColor="textSecondary">
              L&apos;assistant réfléchit...
            </ThemedText>
          </View>
        )}

        <View
          style={[styles.inputRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Écris ta question..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            multiline
          />
          <Pressable
            onPressIn={handleMicPressIn}
            onPressOut={handleMicPressOut}
            disabled={transcribing}
            style={[
              styles.micButton,
              {
                backgroundColor: recorderState.isRecording ? '#DC3545' : 'transparent',
                borderColor: theme.border,
              },
            ]}>
            {transcribing ? (
              <ActivityIndicator size="small" color={theme.textSecondary} />
            ) : (
              <Ionicons
                name={recorderState.isRecording ? 'mic' : 'mic-outline'}
                size={17}
                color={recorderState.isRecording ? '#ffffff' : theme.textSecondary}
              />
            )}
          </Pressable>
          <Pressable
            onPress={handleSend}
            disabled={loading || !input.trim()}
            style={[styles.sendButton, { backgroundColor: theme.tint, opacity: loading || !input.trim() ? 0.5 : 1 }]}>
            <Ionicons name="send" color="#ffffff" size={16} />
          </Pressable>
        </View>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  safeArea: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  header: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    gap: Spacing.half,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
  },
  list: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  listContent: {
    gap: Spacing.two,
    padding: Spacing.three,
    flexGrow: 1,
  },
  messageGroupUser: {
    alignItems: 'flex-end',
    gap: Spacing.two,
  },
  messageGroupAssistant: {
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    maxWidth: '85%',
    padding: Spacing.two,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  storyCardImage: {
    width: 48,
    height: 48,
    borderRadius: Spacing.two,
  },
  storyCardText: {
    flex: 1,
    gap: 2,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: Spacing.one,
  },
  bubbleAssistant: {
    alignSelf: 'flex-start',
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomLeftRadius: Spacing.one,
  },
  bubbleUserText: {
    color: '#ffffff',
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.half,
    marginTop: Spacing.one,
  },
  speakLabel: {
    fontSize: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.six,
  },
  emptyText: {
    textAlign: 'center',
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.two,
    marginHorizontal: Spacing.three,
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
    padding: Spacing.two,
    borderRadius: Spacing.four,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    fontSize: 14,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
