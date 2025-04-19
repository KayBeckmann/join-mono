import { defineStore } from 'pinia';
// Pfad anpassen, falls deine Typen woanders liegen oder du TS-Aliase verwendest
import { TaskPriority } from '../../../shared/src/types/Task';

// Hilfsfunktion zum Konvertieren von Timestamp zu Date (oder direkt im Store lassen)
const timestampToDate = (timestamp) => {
  if (!timestamp || isNaN(timestamp)) return null;
  return new Date(timestamp);
};


export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [], // Wird mit Task[] typisiert, wenn du TS verwendest
    isLoading: false,
    error: null,
  }),

  getters: {
    // Gesamtzahl der Tasks
    totalTaskCount: (state) => state.tasks.length,

    // Anzahl Tasks mit hoher Priorität (Urgent)
    urgentTaskCount: (state) => {
      return state.tasks.filter(task => task.priority === TaskPriority.Urgent).length;
    },

    // Nächstes Fälligkeitsdatum (als Date-Objekt oder null)
    nextDueDate: (state) => {
      const upcomingTasks = state.tasks
        .map(task => ({ ...task, dueDateObj: timestampToDate(task.dueDate) })) // Konvertiere zu Date-Objekten
        .filter(task => task.dueDateObj && task.dueDateObj >= new Date(new Date().setHours(0, 0, 0, 0))); // Nur zukünftige/heutige Daten

      if (upcomingTasks.length === 0) {
        return null; // Kein bevorstehendes Datum
      }

      // Sortiere nach Datum und nimm das früheste
      upcomingTasks.sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime());
      return upcomingTasks[0].dueDateObj;
    },

    // Getter für Tasks nach Status (Beispiel für spätere Board-Nutzung)
    getTasksByState: (state) => {
        // Stelle sicher, dass TaskState importiert ist
        // import { TaskState } from '../../../shared/src/types/Task';
        return (status /*: TaskState*/) => {
            return state.tasks.filter(task => task.state === status);
        }
    }
  },

  actions: {
    // Beispielhafte Action zum Laden von Tasks
    // Später mit Dexie und API-Fetch ersetzen
    async fetchTasks() {
      this.isLoading = true;
      this.error = null;
      try {
        // --- Nur zu Testzwecken ---
        // Später ersetzen durch:
        // 1. Versuch aus Dexie zu laden (await db.tasks.toArray())
        // 2. Wenn leer/veraltet: Fetch vom Backend API ('/api/tasks')
        // 3. Dexie aktualisieren
        // 4. Pinia State (this.tasks) aktualisieren
        console.log("Fetching tasks (placeholder)...");
        // Simuliere API-Aufruf mit Musterdaten
        // Wichtig: Importiere TaskPriority korrekt
        await new Promise(resolve => setTimeout(resolve, 500)); // Simuliere Ladezeit
        this.tasks = [
          { id: 0, title: "Muster 1", description: "...", priority: TaskPriority.Urgent, category: { id: 1, name: "Marketing", color: "var(--orange)" }, assignedTo: [1], dueDate: Date.now() + 86400000 * 2, state: 'ToDo', subtask: [] },
          { id: 1, title: "Muster 2", description: "...", priority: TaskPriority.Medium, category: { id: 2, name: "Sales", color: "var(--light-blue)" }, assignedTo: [1], dueDate: Date.now() + 86400000 * 5, state: 'progress', subtask: [] },
          { id: 2, title: "Muster 3", description: "...", priority: TaskPriority.Urgent, category: { id: 1, name: "Marketing", color: "var(--orange)" }, assignedTo: [2], dueDate: Date.now() - 86400000, state: 'done', subtask: [] }, // Vergangenheit
           { id: 3, title: "Muster 4", description: "...", priority: TaskPriority.Low, category: { id: 1, name: "Marketing", color: "var(--orange)" }, assignedTo: [2], dueDate: Date.now() + 86400000 * 1, state: 'awaiting', subtask: [] }, // Morgen
        ];
        // --- Ende Testdaten ---

      } catch (err) {
        this.error = err.message || 'Fehler beim Laden der Tasks';
        console.error("Error fetching tasks:", err);
      } finally {
        this.isLoading = false;
      }
    },

    // Hier kommen später Aktionen wie addTask, updateTask, deleteTask hinzu
  }
});