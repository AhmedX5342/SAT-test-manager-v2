import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Folder, Test, DataContextType } from '../types';

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useLocalStorage<Folder[]>('sat_folders', []);
  const [tests, setTests] = useLocalStorage<Test[]>('sat_tests', []);

  const createFolder = useCallback((name: string): Folder => {
    const folder: Folder = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() };
    setFolders(prev => [...prev, folder]);
    return folder;
  }, [setFolders]);

  const deleteFolder = useCallback((id: string): void => {
    setFolders(prev => prev.filter(f => f.id !== id));
    setTests(prev => prev.map(t => t.folderId === id ? { ...t, folderId: null } : t));
  }, [setFolders, setTests]);

  const renameFolder = useCallback((id: string, name: string): void => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  }, [setFolders]);

  const addTest = useCallback((test: Omit<Test, 'id' | 'createdAt' | 'answers' | 'guessed' | 'requiresStudy' | 'corrections' | 'rawScore' | 'scaledScore' | 'maxScaledScore'>): Test => {
    const newTest = {
      id: crypto.randomUUID(),
      ...test,
      createdAt: new Date().toISOString(),
      answers: {},
      guessed: [],
      requiresStudy: [],
      corrections: null,
      rawScore: null,
      scaledScore: null,
      maxScaledScore: null,
      folderId: test.folderId || null,
    };
    setTests(prev => [...prev, newTest]);
    return newTest;
  }, [setTests]);

  const updateTest = useCallback((id: string, updates: Partial<Test>): void => {
    setTests(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [setTests]);

  const deleteTest = useCallback((id: string): void => {
    setTests(prev => prev.filter(t => t.id !== id));
  }, [setTests]);

  const moveTestToFolder = useCallback((testId: string, folderId: string | null): void => {
    setTests(prev => prev.map(t => t.id === testId ? { ...t, folderId } : t));
  }, [setTests]);

  const importData = useCallback((data: { folders?: Folder[]; tests?: Test[] }): void => {
    if (data.folders) setFolders(data.folders);
    if (data.tests) setTests(data.tests);
  }, [setFolders, setTests]);

  const clearAll = useCallback((): void => {
    setFolders([]);
    setTests([]);
  }, [setFolders, setTests]);

  const value: DataContextType = {
    folders,
    tests,
    createFolder,
    deleteFolder,
    renameFolder,
    addTest,
    updateTest,
    deleteTest,
    moveTestToFolder,
    importData,
    clearAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
