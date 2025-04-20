import { defineStore } from 'pinia';
import { db } from '../db'; // Importiere die Dexie DB Instanz
// Pfade anpassen für Typen/Enums
import { TaskPriority, TaskState } from '../../../shared/src/types/Task';
// Ggf. Typ für Task importieren, wenn du TS verwendest
// import { Task } from '../../../shared/src/types/Task';

// --- HINWEIS: Dies ist eine vereinfachte Implementierung ---
// Eine robuste Offline-Synchronisation erfordert mehr:
// - Queue für Änderungen (separate Dexie Tabelle)
// - Hintergrund-Sync-Prozess (mit Network API prüfen)
// - Fehlerbehandlung bei API-Aufrufen
// - Konflikterkennung und -lösung

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: [], // Task[] wenn TS
    isLoading: false,
    isSyncing: false, // Für spätere Sync-Anzeige
    error: null,
    lastSync: null, // Zeitpunkt der letzten Backend-Synchronisation
  }),

  getters: {
    totalTaskCount: (state) => state.tasks.length,
    urgentTaskCount: (state) => {
      return state.tasks.filter(task => task.priority === TaskPriority.Urgent).length;
    },
    nextDueDate: (state) => {
       // (Implementierung wie vorher)
       const timestampToDate = (timestamp) => { /* ... */ };
       const upcomingTasks = state.tasks
         .map(task => ({ ...task, dueDateObj: timestampToDate(task.dueDate) }))
         .filter(task => task.dueDateObj && task.dueDateObj >= new Date(new Date().setHours(0, 0, 0, 0)));
       if (upcomingTasks.length === 0) return null;
       upcomingTasks.sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime());
       return upcomingTasks[0].dueDateObj;
    },
    // Gibt Tasks gruppiert nach Status zurück
    getTasksByState: (state) => {
      return (status /*: TaskState*/) => {
        return state.tasks.filter(task => task.state === status);
      }
    }
  },

  actions: {
    /**
     * Lädt Tasks: Zuerst aus Dexie, dann Fetch vom Backend im Hintergrund.
     * Einfache "Backend überschreibt lokal"-Strategie für den Anfang.
     */
    async fetchTasks() {
      this.isLoading = true;
      this.error = null;
      console.log("Lade Tasks aus Dexie...");
      try {
        // 1. Aus Dexie laden und sofort anzeigen
        const tasksFromDb = await db.tasks.toArray();
        if (tasksFromDb.length > 0) {
          this.tasks = tasksFromDb;
          console.log(`Anzeige von ${tasksFromDb.length} Tasks aus Dexie.`);
        }

        // 2. Im Hintergrund vom Backend fetchen (später implementieren)
        console.log("Fetch vom Backend gestartet (Placeholder)...");
        this.isSyncing = true; // Zeigt an, dass wir versuchen zu syncen
        // const response = await fetch('/api/tasks/summary'); // Oder vollständige Tasks
        // if (!response.ok) throw new Error('Backend-Fehler');
        // const tasksFromBackend = await response.json();

        // --- Nur zu Testzwecken ---
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simuliere Ladezeit
        const tasksFromBackend = [ // Simuliere Backend-Antwort
           { id: 'uuid-1', title: "Backend Task 1", description: "Vom Server", priority: TaskPriority.Urgent, category: { id: 1, name: "Marketing", color: "var(--orange)" }, assignedTo: ['user-uuid-1'], dueDate: Date.now() + 86400000 * 3, state: TaskState.ToDo, subtask: [] },
           { id: 'uuid-2', title: "Backend Task 2", description: "...", priority: TaskPriority.Medium, category: { id: 2, name: "Sales", color: "var(--light-blue)" }, assignedTo: ['user-uuid-1'], dueDate: Date.now() + 86400000 * 6, state: TaskState.InProgress, subtask: [] },
           { id: 'uuid-4', title: "Neuer Backend Task", description: "...", priority: TaskPriority.Low, category: { id: 1, name: "Marketing", color: "var(--orange)" }, assignedTo: ['user-uuid-2'], dueDate: Date.now() + 86400000 * 1, state: TaskState.AwaitingFeedback, subtask: [] },
        ];
        console.log(`Empfangen von ${tasksFromBackend.length} Tasks vom Backend.`);
        // --- Ende Testdaten ---


        // 3. Daten aktualisieren (Einfache Ersetzung)
        // TODO: Hier müsste später die Konfliktlösung rein!
        // Vergleiche tasksFromBackend mit tasksFromDb / this.tasks
        // Für den Anfang: Überschreibe einfach die lokalen Daten
        this.tasks = tasksFromBackend;
        await db.tasks.clear(); // Lösche alte Dexie-Daten
        await db.tasks.bulkPut(tasksFromBackend); // Speichere neue Daten in Dexie
        console.log("Dexie und State mit Backend-Daten aktualisiert.");
        this.lastSync = new Date();


      } catch (err) {
        this.error = err.message || 'Fehler beim Laden/Synchronisieren der Tasks';
        console.error("Error in fetchTasks:", err);
        // Wenn Backend nicht erreichbar, bleiben die Dexie-Daten bestehen
      } finally {
        this.isLoading = false;
        this.isSyncing = false;
      }
    },

    /**
     * Aktualisiert den Status eines Tasks (z.B. durch Drag & Drop).
     * Speichert SOFORT in Dexie (Optimistic UI).
     * TODO: Änderung in Sync-Queue für Backend eintragen.
     */
    async updateTaskState(taskId /*: string*/, newState /*: TaskState*/) {
        console.log(`Update Task ${taskId} to state ${newState}`);
        try {
            // 1. Finde den Task im lokalen State
            const taskIndex = this.tasks.findIndex(t => t.id === taskId);
            if (taskIndex === -1) throw new Error(`Lokaler Task ${taskId} nicht gefunden.`);

            // 2. Erstelle das Update-Objekt
            const updatedTaskData = { ...this.tasks[taskIndex], state: newState };

            // 3. Aktualisiere Dexie sofort
            await db.tasks.put(updatedTaskData);
            console.log(`Task ${taskId} in Dexie aktualisiert.`);

            // 4. Aktualisiere den Pinia State sofort
            this.tasks[taskIndex] = updatedTaskData;

            // 5. TODO: Füge die Änderung zur Sync-Queue hinzu
            // await db.syncQueue.add({ type: 'update', taskId: taskId, changes: { state: newState }, timestamp: Date.now() });
            // console.log(`Änderung für Task ${taskId} zur Sync-Queue hinzugefügt.`);

            // 6. TODO: Triggere ggf. den Hintergrund-Sync-Prozess


        } catch (error) {
            console.error(`Fehler beim lokalen Update von Task ${taskId}:`, error);
            // TODO: Fehler dem User anzeigen? Rollback?
            this.error = `Konnte Task ${taskId} lokal nicht aktualisieren.`;
        }
    },

     /**
     * Fügt einen neuen Task hinzu.
     * Speichert SOFORT in Dexie (Optimistic UI).
     * TODO: Änderung in Sync-Queue für Backend eintragen.
     */
    async addTask(newTaskData /*: Omit<Task, 'id'> */) {
        // (Implementierung ähnlich wie updateTaskState:
        //  1. UUID generieren (wenn nicht vom Backend) mit `uuid` library
        //  2. In Dexie speichern (db.tasks.add(...))
        //  3. Pinia State aktualisieren (this.tasks.push(...))
        //  4. Zur Sync-Queue hinzufügen ({ type: 'create', taskData: {...} })
        //  5. Sync anstoßen )
         console.log("addTask called (Placeholder)", newTaskData);
         // Beispielhafte Implementierung (ohne UUID Lib & Sync Queue)
         try {
            const tempId = `local-${Date.now()}`; // Temporäre lokale ID
            const taskToAdd = { ...newTaskData, id: tempId, /* state ggf. setzen */ };
            await db.tasks.add(taskToAdd);
            this.tasks.push(taskToAdd);
            console.log(`Task ${tempId} lokal hinzugefügt.`);
            // TODO: Sync Queue etc.
         } catch(error) {
             console.error("Fehler beim lokalen Hinzufügen:", error);
         }
    },

    // Placeholder für volles Update über Modal
     async updateTask(taskId /*: string*/, updatedTaskData /*: Partial<Task>*/) {
         console.log("updateTask called (Placeholder)", taskId, updatedTaskData);
         // (Implementierung ähnlich wie updateTaskState, aber mit mehr Feldern
         //  1. Task im State finden
         //  2. Daten mergen
         //  3. Dexie updaten (db.tasks.put(...))
         //  4. Pinia State updaten (this.tasks[index] = ...)
         //  5. Zur Sync-Queue hinzufügen ({ type: 'update', taskId: ..., changes: {...} })
         //  6. Sync anstoßen )
     },

     // Placeholder für Löschen
      async deleteTask(taskId /*: string*/) {
          console.log("deleteTask called (Placeholder)", taskId);
         // (Implementierung:
         //  1. Aus Dexie löschen (db.tasks.delete(...))
         //  2. Aus Pinia State entfernen (this.tasks = this.tasks.filter(...))
         //  3. Zur Sync-Queue hinzufügen ({ type: 'delete', taskId: ... })
         //  4. Sync anstoßen )
      }

    // ... weitere Aktionen ...
  }
});