import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // Deine DB-Instanz
// Importiere Enums/Typen aus dem Shared-Paket
import { TaskState, TaskPriority } from '../../../shared/src/types/Task.js'; // Pfad prüfen!

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,       // UUID als Primärschlüssel
    defaultValue: DataTypes.UUIDV4, // Automatisch UUID generieren
    primaryKey: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT, // Längerer Text möglich
    allowNull: true,      // Beschreibung kann optional sein
  },
  priority: {
    type: DataTypes.INTEGER, // Speichert den numerischen Wert des Enums (-1, 0, 1)
    allowNull: false,
    validate: {
       isIn: [[TaskPriority.Urgent, TaskPriority.Medium, TaskPriority.Low]], // Stellt sicher, dass nur gültige Werte gespeichert werden
    }
  },
  // Speichert das Category-Objekt als JSON-String.
  // Hinweis: Besser wäre eine separate Category-Tabelle mit einer Beziehung (Foreign Key).
  // Für den Anfang ist dies aber näher am ursprünglichen Projekt.
  category: {
      type: DataTypes.JSON,
      allowNull: true, // Oder false, je nach Anforderung
  },
  // Speichert das Array der User-UUIDs als JSON-String.
  // Hinweis: Besser wäre eine Many-to-Many-Beziehungstabelle (z.B. UserTasks).
  assignedTo: {
      type: DataTypes.JSON, // Speichert ['uuid1', 'uuid2', ...]
      allowNull: true,
      defaultValue: [], // Standardmäßig leeres Array
  },
  dueDate: {
    type: DataTypes.DATE, // Sequelize wandelt JS Date/Timestamp um
    allowNull: true,
  },
  state: {
    type: DataTypes.ENUM( // Nutzt die Enum-Werte aus dem Shared-Paket
        TaskState.ToDo,
        TaskState.InProgress,
        TaskState.AwaitingFeedback,
        TaskState.Done
    ),
    allowNull: false,
    defaultValue: TaskState.ToDo, // Standardwert für neue Tasks
  },
  // subtask: Wird später hinzugefügt
}, {
  // Model-Optionen (z.B. Tabellenname, Timestamps)
  timestamps: true, // Fügt createdAt und updatedAt hinzu (Standard)
});

export default Task;