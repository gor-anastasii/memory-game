const KEY = "memory-game-leaderboard";
const LIMIT = 10;

export function loadResults() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveResult(moves) {
  const results = loadResults();
  results.push({ moves, timestamp: Date.now() });
  results.sort((a, b) => a.moves - b.moves || a.timestamp - b.timestamp);
  try {
    localStorage.setItem(KEY, JSON.stringify(results.slice(0, LIMIT)));
  } catch {
    console.log("Хранилище недоступно");
  }
}

export function formatDate(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
}
