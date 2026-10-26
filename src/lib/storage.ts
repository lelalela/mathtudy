import { useSyncExternalStore } from 'react';
import { UserProgressRecord } from './generators/types';

const STORAGE_KEY = 'mathtudy_user_progress_v1';

export function getDefaultProgress(): UserProgressRecord {
  return {
    totalSolved: 0,
    totalCorrect: 0,
    streak: 0,
    lastActiveDate: '',
    topicMastery: {},
    incorrectProblemIds: [],
  };
}

const DEFAULT_SNAPSHOT: UserProgressRecord = Object.freeze(getDefaultProgress());

let currentSnapshot: UserProgressRecord = DEFAULT_SNAPSHOT;
let isLoadedFromStorage = false;
let listeners: Array<() => void> = [];

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeProgress(listener: () => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function getProgressSnapshot(): UserProgressRecord {
  if (typeof window === 'undefined') return DEFAULT_SNAPSHOT;
  if (!isLoadedFromStorage) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        currentSnapshot = { ...DEFAULT_SNAPSHOT, ...JSON.parse(raw) };
      }
    } catch (err) {
      console.error('Failed to read progress from storage:', err);
    }
    isLoadedFromStorage = true;
  }
  return currentSnapshot;
}

export function getServerSnapshot(): UserProgressRecord {
  return DEFAULT_SNAPSHOT;
}

export function loadProgress(): UserProgressRecord {
  return getProgressSnapshot();
}

export function saveProgress(progress: UserProgressRecord): void {
  currentSnapshot = progress;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.error('Failed to save progress to localStorage:', err);
    }
  }
  emitChange();
}

export function useUserProgress(): UserProgressRecord {
  return useSyncExternalStore(
    subscribeProgress,
    getProgressSnapshot,
    getServerSnapshot
  );
}

export function recordProblemResult(
  topicId: string,
  isCorrect: boolean,
  problemId?: string
): UserProgressRecord {
  const current = getProgressSnapshot();
  const today = new Date().toISOString().split('T')[0];

  // Update streak
  let streak = current.streak || 0;
  if (current.lastActiveDate && current.lastActiveDate !== today) {
    const lastDate = new Date(current.lastActiveDate);
    const nowDate = new Date(today);
    const diffDays = Math.round((nowDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  } else if (!current.lastActiveDate) {
    streak = 1;
  }

  // Update topic mastery
  const existingTopic = current.topicMastery[topicId] || {
    solved: 0,
    correct: 0,
    lastPracticed: today,
    level: 0,
  };

  const updatedSolved = existingTopic.solved + 1;
  const updatedCorrect = existingTopic.correct + (isCorrect ? 1 : 0);
  const accuracy = updatedCorrect / updatedSolved;

  // Level computation: 0 to 5 based on solved count & accuracy
  let level = 0;
  if (updatedSolved >= 3 && accuracy >= 0.5) level = 1;
  if (updatedSolved >= 6 && accuracy >= 0.6) level = 2;
  if (updatedSolved >= 10 && accuracy >= 0.7) level = 3;
  if (updatedSolved >= 15 && accuracy >= 0.8) level = 4;
  if (updatedSolved >= 25 && accuracy >= 0.85) level = 5;

  const updatedMastery = {
    ...current.topicMastery,
    [topicId]: {
      solved: updatedSolved,
      correct: updatedCorrect,
      lastPracticed: today,
      level,
    },
  };

  // Manage incorrect list
  let incorrectList = [...current.incorrectProblemIds];
  if (!isCorrect && problemId) {
    if (!incorrectList.includes(problemId)) {
      incorrectList.push(problemId);
    }
  } else if (isCorrect && problemId) {
    incorrectList = incorrectList.filter((id) => id !== problemId);
  }

  const updated: UserProgressRecord = {
    ...current,
    totalSolved: current.totalSolved + 1,
    totalCorrect: current.totalCorrect + (isCorrect ? 1 : 0),
    streak: streak === 0 ? 1 : streak,
    lastActiveDate: today,
    topicMastery: updatedMastery,
    incorrectProblemIds: incorrectList,
  };

  saveProgress(updated);
  return updated;
}

export function exportProgressAsJson(): void {
  if (typeof window === 'undefined') return;
  const progress = getProgressSnapshot();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `mathtudy_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importProgressFromJson(jsonText: string): boolean {
  try {
    const parsed = JSON.parse(jsonText);
    if (typeof parsed === 'object' && parsed !== null) {
      saveProgress(parsed);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to import progress JSON:', err);
    return false;
  }
}
