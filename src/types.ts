export interface Folder {
  id: string;
  name: string;
  parentId: string | null;  // Add parentId for nesting
  createdAt: string;
}

export interface Correction {
  correct: boolean;
  correctAnswer: string;
}

export interface Corrections {
  [key: string]: Correction;
}

export interface Overrides {
  [key: string]: { wrong: boolean; note: string };
}

export interface Test {
  id: string;
  name: string;
  numQuestions: number;
  timerEnabled: boolean;
  timerMinutes: number;
  folderId: string | null;
  createdAt: string;
  answers: { [key: number]: string | null };
  guessed: number[];
  requiresStudy: number[];
  corrections: Corrections | null;
  rawScore: number | null;
  scaledScore: number | null;
  maxScaledScore: number | null;
}

export interface ViewSettings {
  viewMode: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'type';
  sortOrder: 'asc' | 'desc';
}

export interface DataContextType {
  folders: Folder[];
  tests: Test[];
  viewSettings: ViewSettings;
  createFolder: (name: string, parentId: string | null) => Folder;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, name: string) => void;
  moveFolder: (folderId: string, targetParentId: string | null) => void;
  addTest: (test: Omit<Test, 'id' | 'createdAt' | 'answers' | 'guessed' | 'requiresStudy' | 'corrections' | 'rawScore' | 'scaledScore' | 'maxScaledScore'>) => Test;
  updateTest: (id: string, updates: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  moveTestToFolder: (testId: string, folderId: string | null) => void;
  getFolderContents: (folderId: string | null) => { folders: Folder[]; tests: Test[] };
  getFolderPath: (folderId: string | null) => Folder[];
  updateViewSettings: (settings: Partial<ViewSettings>) => void;
  importData: (data: { folders?: Folder[]; tests?: Test[] }) => void;
  clearAll: () => void;
}

export interface Message {
  text: string;
  type: 'success' | 'error';
}