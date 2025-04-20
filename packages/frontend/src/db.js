// packages/frontend/src/db.js
import Dexie from 'dexie';

// Stelle sicher, dass 'export' hier steht!
export const db = new Dexie('joinDB');

db.version(1).stores({
  // 'id' ist der Primärschlüssel (Typ string/UUID), keine Auto-Inkrementierung '++'
  users: 'id, name, email',
  tasks: 'id, title, state, categoryId, dueDate, updatedAt', // Füge Indizes hinzu, die du brauchst
  categories: 'id, name',
  // Optional: Tabelle für die Sync-Queue
  // syncQueue: '++id, type, timestamp',
});

// Du könntest hier auch weitere Dexie-bezogene Logik oder Exporte hinzufügen
// export { anotherThing } ...