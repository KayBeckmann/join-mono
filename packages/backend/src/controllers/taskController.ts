import Task from '../models/TaskModel.js'; // Importiere das Task-Modell
// Ggf. Typen für Request/Response importieren, wenn du TS verwendest

/**
 * Gibt eine Liste aller Tasks zurück, aber nur mit ausgewählten Feldern.
 */
export const getAllTasksSummary = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      attributes: ['id', 'title', 'priority', 'dueDate', 'state'], // Nur diese Felder auswählen
      order: [['createdAt', 'ASC']] // Beispiel-Sortierung
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching task summary:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Task-Übersicht.', error: error.message });
  }
};

/**
 * Gibt alle Details für einen einzelnen Task anhand seiner ID zurück.
 */
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params; // Hole die ID aus den URL-Parametern
    const task = await Task.findByPk(id);

    if (task) {
      res.status(200).json(task);
    } else {
      res.status(404).json({ message: 'Task nicht gefunden.' });
    }
  } catch (error) {
    console.error(`Error fetching task with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Tasks.', error: error.message });
  }
};

/**
 * Erstellt einen neuen Task.
 */
export const createTask = async (req, res) => {
  try {
    // Hole Daten aus dem Request Body
    // Validierung der Daten wäre hier sinnvoll!
    const { title, description, priority, category, assignedTo, dueDate, state } = req.body;

    // Erstelle den Task in der Datenbank (Sequelize generiert die UUID)
    const newTask = await Task.create({
        title,
        description,
        priority,
        category, // Nimmt das JSON-Objekt direkt entgegen
        assignedTo, // Nimmt das Array direkt entgegen
        dueDate,    // Kann ein Date-Objekt oder Timestamp sein
        state       // Sollte ein gültiger TaskState sein
    });

    res.status(201).json(newTask); // Gib den neu erstellten Task zurück
  } catch (error) {
    console.error('Error creating task:', error);
    // Bei Validierungsfehlern von Sequelize kommt oft ein 'SequelizeValidationError'
    if (error.name === 'SequelizeValidationError') {
         res.status(400).json({ message: 'Validierungsfehler.', errors: error.errors.map(e => e.message) });
    } else {
         res.status(500).json({ message: 'Fehler beim Erstellen des Tasks.', error: error.message });
    }
  }
};

/**
 * Aktualisiert einen vorhandenen Task.
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Daten für das Update

    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task nicht gefunden.' });
    }

    // Aktualisiere den Task mit den neuen Daten
    await task.update(updateData);

    res.status(200).json(task); // Gib den aktualisierten Task zurück
  } catch (error) {
    console.error(`Error updating task with id ${req.params.id}:`, error);
     if (error.name === 'SequelizeValidationError') {
         res.status(400).json({ message: 'Validierungsfehler.', errors: error.errors.map(e => e.message) });
    } else {
        res.status(500).json({ message: 'Fehler beim Aktualisieren des Tasks.', error: error.message });
    }
  }
};

/**
 * Löscht einen Task.
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({ message: 'Task nicht gefunden.' });
    }

    // Lösche den Task
    await task.destroy();

    res.status(204).send(); // Kein Inhalt zurücksenden bei erfolgreichem Löschen
    // Alternativ: res.status(200).json({ message: 'Task erfolgreich gelöscht.' });
  } catch (error) {
    console.error(`Error deleting task with id ${req.params.id}:`, error);
    res.status(500).json({ message: 'Fehler beim Löschen des Tasks.', error: error.message });
  }
};