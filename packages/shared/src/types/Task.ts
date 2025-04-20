import { User } from './User'; // Importiere ggf. andere geteilte Typen

export enum TaskState {
  ToDo = 'ToDo',
  InProgress = 'progress', // Namen aus altem Code beibehalten
  AwaitingFeedback = 'awaiting',
  Done = 'done',
}

export enum TaskPriority {
   Urgent = -1,
   Medium = 0,
   Low = 1,
}

export interface Subtask {
  id: number | string; // Optional, je nachdem ob vom Backend oder Frontend generiert
  description: string;
  done: boolean;
}

export interface Category {
    id: number | string;
    name: string;
    color: string; // z.B. 'var(--orange)' oder '#FF8A00'
}

export interface Task {
  id: number | string; // ID kann number (SQL) oder string (Dexie?) sein
  title: string;
  description: string;
  priority: TaskPriority;
  category: Category; // Oder nur categoryId: number | string;
  assignedTo: Array<number | string>; // Array von User-IDs
  dueDate: Date; // UNIX Timestamp (wie im alten Code)
  state: TaskState;
  subtask: Subtask[];
}