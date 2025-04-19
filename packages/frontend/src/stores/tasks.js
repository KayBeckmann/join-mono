// Beispiel in src/stores/tasks.js (oder .ts)
import { defineStore } from 'pinia';
import { db } from '../db'; // Dexie Instanz
import { Task, TaskState } from 'shared/src/types/Task'; // Import aus shared
// Wichtig: Passe den Importpfad ggf. an deine TS/JS-Konfiguration an.
// Evtl. reicht auch 'shared' wenn Aliase korrekt gesetzt sind.

export const useTaskStore = defineStore('tasks', {
  state: (): { tasks: Task[] } => ({
    tasks: [],
  }),
  actions: {
    async fetchTasks() {
      // ... Logik zum Laden aus Dexie/Backend ...
      // Beispiel: Typisierung beim Holen aus Dexie
      const tasksFromDb: Task[] = await db.table('tasks').toArray();
      this.tasks = tasksFromDb;
      // ... Backend Fetch + Sync ...
    },
    async addTask(newTaskData: Omit<Task, 'id'>) {
        // Typ Omit<Task, 'id'> für Daten ohne ID beim Erstellen
        // ... Logik zum Speichern in Dexie/Backend ...
        // Stelle sicher, dass das Task-Objekt dem Interface Task entspricht
    }
    // ... andere Aktionen (updateTask, deleteTask) ...
  },
  getters: {
    getTasksByState: (state) => {
        return (status: TaskState): Task[] => {
            return state.tasks.filter(task => task.state === status);
        }
    }
  }
});