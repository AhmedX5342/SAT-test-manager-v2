import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Folder, Test, DataContextType, ViewSettings } from '../types';

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useLocalStorage<Folder[]>('sat_folders', []);
  const [tests, setTests] = useLocalStorage<Test[]>('sat_tests', []);
  const [viewSettings, setViewSettings] = useLocalStorage<ViewSettings>('view_settings', {
    viewMode: 'grid',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const createFolder = useCallback((name: string, parentId: string | null = null): Folder => {
    const folder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: new Date().toISOString()
    };
    setFolders(prev => [...prev, folder]);
    return folder;
  }, [setFolders]);

  const deleteFolder = useCallback((id: string): void => {
    const deleteRecursive = (folderId: string) => {
      const subFolders = folders.filter(f => f.parentId === folderId);
      subFolders.forEach(sub => deleteRecursive(sub.id));
      setFolders(prev => prev.filter(f => f.id !== folderId));
      setTests(prev => prev.map(t =>
        t.folderId === folderId ? { ...t, folderId: null } : t
      ));
    };
    deleteRecursive(id);
  }, [folders, setFolders, setTests]);

  const renameFolder = useCallback((id: string, name: string): void => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, name } : f));
  }, [setFolders]);

  const moveFolder = useCallback((folderId: string, targetParentId: string | null): void => {
    if (targetParentId === folderId) return;

    const isChildFolder = (parentId: string | null, childId: string): boolean => {
      if (!parentId) return false;
      const folder = folders.find(f => f.id === parentId);
      if (folder?.parentId === childId) return true;
      return folder ? isChildFolder(folder.parentId, childId) : false;
    };

    if (isChildFolder(targetParentId, folderId)) return;

    setFolders(prev => prev.map(f =>
      f.id === folderId ? { ...f, parentId: targetParentId } : f
    ));
  }, [folders, setFolders]);

  const addTest = useCallback((test: Omit<Test, 'id' | 'createdAt'>): Test => {
    const newTest: Test = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: test.name,
      numQuestions: test.numQuestions,
      timerEnabled: test.timerEnabled ?? false,
      timerMinutes: test.timerMinutes ?? 60,
      folderId: test.folderId ?? null,
      answers: test.answers ?? {},
      guessed: test.guessed ?? [],
      requiresStudy: test.requiresStudy ?? [],
      corrections: test.corrections ?? null,
      rawScore: test.rawScore ?? null,
      scaledScore: test.scaledScore ?? null,
      maxScaledScore: test.maxScaledScore ?? null,
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

  const getFolderContents = useCallback((folderId: string | null) => {
    const subFolders = folders
      .filter(f => f.parentId === folderId)
      .sort((a, b) => a.name.localeCompare(b.name));

    const folderTests = tests
      .filter(t => t.folderId === folderId)
      .sort((a, b) => {
        if (viewSettings.sortBy === 'name') {
          return viewSettings.sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else {
          return viewSettings.sortOrder === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });

    return { folders: subFolders, tests: folderTests };
  }, [folders, tests, viewSettings]);

  const getFolderPath = useCallback((folderId: string | null): Folder[] => {
    if (!folderId) return [];

    const path: Folder[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return path;
  }, [folders]);

  const updateViewSettings = useCallback((settings: Partial<ViewSettings>): void => {
    setViewSettings(prev => ({ ...prev, ...settings }));
  }, [setViewSettings]);

  const importData = useCallback((data: { folders?: Folder[]; tests?: Test[] }): void => {
    if (data.folders && data.folders.length) {
      // Preserve folder structure by keeping parentId as is
      setFolders(data.folders);
    }
    if (data.tests && data.tests.length) {
      // Preserve test folder assignments
      setTests(data.tests);
    }
  }, [setFolders, setTests]);

  const clearAll = useCallback((): void => {
    setFolders([]);
    setTests([]);
  }, [setFolders, setTests]);

  const value: DataContextType = {
    folders,
    tests,
    viewSettings,
    createFolder,
    deleteFolder,
    renameFolder,
    moveFolder,
    addTest,
    updateTest,
    deleteTest,
    moveTestToFolder,
    getFolderContents,
    getFolderPath,
    updateViewSettings,
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