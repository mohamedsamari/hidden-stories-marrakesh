// Classic edit-distance (insert/delete/substitute) between two strings.
function levenshteinDistance(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) matrix[i][0] = i;
  for (let j = 0; j < cols; j++) matrix[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      matrix[i][j] =
        a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
    }
  }

  return matrix[a.length][b.length];
}

// Shorter words tolerate one typo, longer words tolerate two — otherwise a
// 3-letter word would match almost anything within distance 2.
function wordsAreClose(a: string, b: string): boolean {
  const maxDistance = a.length <= 4 || b.length <= 4 ? 1 : 2;
  return levenshteinDistance(a, b) <= maxDistance;
}

function toWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-zàâäéèêëïîôöùûüç0-9]+/)
    .filter(Boolean);
}

// Every word in the query must be close to at least one word in the
// searchable text — same "all words must match" semantics as the exact
// search, just typo-tolerant. Used as a fallback when the exact search
// (ILIKE) finds nothing, so transliterated names spelled differently
// ("Jamaa el fena" vs "Jemaa el-Fna") still resolve.
export function fuzzyMatchesQuery(searchableText: string, query: string): boolean {
  const targetWords = toWords(searchableText);
  const queryWords = toWords(query);

  return queryWords.every((queryWord) =>
    targetWords.some((targetWord) => wordsAreClose(queryWord, targetWord))
  );
}
