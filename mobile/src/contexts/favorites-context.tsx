import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'favorites';

interface FavoritesContextValue {
  favoriteIds: string[];
  isFavorite: (storyId: string) => boolean;
  toggleFavorite: (storyId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: PropsWithChildren) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored) setFavoriteIds(JSON.parse(stored));
    });
  }, []);

  const toggleFavorite = (storyId: string) => {
    setFavoriteIds((current) => {
      const next = current.includes(storyId)
        ? current.filter((id) => id !== storyId)
        : [...current, storyId];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isFavorite = (storyId: string) => favoriteIds.includes(storyId);

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
