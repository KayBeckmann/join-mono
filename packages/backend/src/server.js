import express from 'express';
import cors from 'cors';
// import taskRoutes from './routes/taskRoutes.js'; // Beispiel für spätere Routen
// import userRoutes from './routes/userRoutes.js'; // Beispiel für spätere Routen
// import categoryRoutes from './routes/categoryRoutes.js'; // Beispiel für spätere Routen
// import authRoutes from './routes/authRoutes.js'; // Beispiel für spätere Routen

// Datenbank-Setup (Beispiel für Sequelize - muss angepasst werden!)
import sequelize from './config/database.js';

const app = express();
const PORT = process.env.PORT || 3000; // Port für den Backend-Server

// --- Middleware ---
// CORS aktivieren (damit dein Vue-Frontend Anfragen stellen darf)
// Passe origin ggf. an, wenn dein Frontend woanders läuft
app.use(cors({ origin: 'http://localhost:5173' })); // Erlaube Anfragen von deinem Vue-Dev-Server

// JSON-Body-Parser aktivieren (um JSON aus Requests lesen zu können)
app.use(express.json());

// --- Datenbankverbindung testen (Beispiel für Sequelize) ---
async function initializeDatabase() {
  try {
    // Teste die Verbindung
    await sequelize.authenticate();
    console.log('✅ Datenbankverbindung erfolgreich hergestellt.');

    // Synchronisiere Modelle mit der Datenbank (erstellt Tabellen, falls nicht vorhanden)
    // ACHTUNG: force: true löscht vorhandene Tabellen und erstellt sie neu! Nur für Entwicklung!
    // In Produktion solltest du Migrationen verwenden.
    await sequelize.sync({ force: false }); // force: false ist sicherer
    console.log('✅ Datenbank synchronisiert.');

  } catch (error) {
    console.error('❌ Fehler bei der Initialisierung der Datenbank:', error);
  }
}

initializeDatabase();

// --- Routen ---
// Einfache Test-Route
app.get('/api', (req, res) => {
  res.json({ message: 'Hallo vom Join Backend!' });
});

// Hier würden später die spezifischen API-Routen eingebunden werden:
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/categories', categoryRoutes);


// --- Server starten ---
app.listen(PORT, () => {
  console.log(`🚀 Backend-Server läuft auf Port ${PORT}`);
});