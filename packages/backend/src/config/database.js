import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper, um den Pfad relativ zur aktuellen Datei zu bestimmen (wichtig für ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zur SQLite-Datei (wird im 'db'-Ordner im Backend-Root erstellt)
// '..' geht vom 'config' Ordner eine Ebene hoch, dann in 'db'
const storagePath = path.join(__dirname, '..', '..', 'db', 'database.sqlite');

// Erstelle die Sequelize-Instanz für SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite', // Gib an, dass du SQLite verwendest
  storage: storagePath, // Pfad zur Datenbankdatei
  logging: console.log, // SQL-Queries in der Konsole anzeigen (oder false zum Deaktivieren)
  // logging: false, // Deaktiviere Logging für eine sauberere Konsole
});

export default sequelize; // Exportiere die konfigurierte Instanz