import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MemoriesContext = createContext(null);

/**
 * shape Memory:
 * {
 *   id: string, category: 'joy'|'personal'|'challenges',
 *   title: string, description: string,
 *   dateISO: string,     // '2025-09-18' (локальная дата) или ISO
 *   photoUri?: string,   // file://... или asset uri
 *   createdAt: number
 * }
 */

export function MemoriesProvider({ children }) {
  const [memories, setMemories] = useState([]);

  // загрузка/сохранение
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@air_moments_diary__memories');
        if (raw) setMemories(JSON.parse(raw));
      } catch {}
    })();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem('@air_moments_diary__memories', JSON.stringify(memories)).catch(() => {});
  }, [memories]);

  const addMemory = (m) => {
    setMemories((arr) => [{ ...m, id: String(Date.now()), createdAt: Date.now() }, ...arr]);
  };
  const updateMemory = (id, patch) => setMemories((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeMemory = (id) => setMemories((arr) => arr.filter((x) => x.id !== id));

  const getByDate = (dateISO) => memories.filter((m) => (m.dateISO || '').slice(0, 10) === dateISO.slice(0, 10));
  const value = useMemo(() => ({ memories, addMemory, updateMemory, removeMemory, getByDate }), [memories]);

  return <MemoriesContext.Provider value={value}>{children}</MemoriesContext.Provider>;
}

export const useMemories = () => {
  const ctx = useContext(MemoriesContext);
  if (!ctx) throw new Error('useMemories must be used within MemoriesProvider');
  return ctx;
};
