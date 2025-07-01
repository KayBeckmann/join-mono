# Join Kanban Board (Monorepo Refactor)

Dieses Projekt ist eine modernisierte Version des ursprünglichen "Join" Kanban-Board-Projekts[cite: 1], neu aufgebaut als Monorepo mit einem Vue 3 Frontend und einem Express.js Backend. Es nutzt moderne Webtechnologien für eine verbesserte Struktur, Wartbarkeit und potenzielle Offline-Fähigkeiten.

## ✨ Features (Aktuell & Geplant)

- **Kanban Board:** Visuelle Darstellung von Tasks in Spalten (ToDo, In Bearbeitung, etc.).
- **Task Management:** Erstellen, Anzeigen, Bearbeiten (teilweise implementiert) und Löschen von Tasks (teilweise implementiert).
- **Drag & Drop:** Verschieben von Tasks zwischen Status-Spalten.
- **Lokale Persistenz:** Nutzung von Dexie.js (IndexedDB) im Frontend für schnellen Zugriff und grundlegende Offline-Anzeige.
- **(Geplant):** Vollständige Offline-Synchronisation mit Konfliktlösung.
- **(Geplant):** Benutzer-Authentifizierung (Login/Signup).
- **(Geplant):** Kontaktverwaltung.
- **(Geplant):** Übersichts-Dashboard (teilweise implementiert).
- **(Geplant):** Subtasks.

## 🚀 Tech Stack

- **Monorepo:** [pnpm Workspaces](https://pnpm.io/workspaces)
- **Frontend (`packages/frontend`):**
  - [Vue 3](https://vuejs.org/) (mit Composition API & `<script setup>`)
  - [Vite](https://vitejs.dev/) (Build-Tool / Dev-Server)
  - [Pinia](https://pinia.vuejs.org/) (State Management)
  - [Vue Router](https://router.vuejs.org/) (Client-seitiges Routing)
  - [Dexie.js](https://dexie.org/) (Wrapper für IndexedDB)
  - (Optional/Empfohlen: [TypeScript](https://www.typescriptlang.org/))
- **Backend (`packages/backend`):**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/) (Web-Framework)
  - [Sequelize](https://sequelize.org/) (ORM - Object-Relational Mapper)
  - [SQLite](https://www.sqlite.org/) (SQL-Datenbank)
  - [CORS](https://www.npmjs.com/package/cors) (Cross-Origin Resource Sharing Middleware)
  - (Optional/Empfohlen: [TypeScript](https://www.typescriptlang.org/))
- **Shared (`packages/shared`):**
  - [TypeScript](https://www.typescriptlang.org/) (Für geteilte Typen/Interfaces zur Datensicherheit)

## 📁 Projektstruktur

Das Projekt ist als Monorepo organisiert:

- `packages/`: Enthält die einzelnen Anwendungs- und Bibliotheksteile.
  - `frontend/`: Die Vue 3 Single-Page Application.
  - `backend/`: Der Express.js API-Server.
  - `shared/`: Code (hauptsächlich TypeScript-Typen/-Interfaces), der von Frontend und Backend gemeinsam genutzt wird.

## 🛠️ Voraussetzungen

- [Node.js](https://nodejs.org/) (LTS-Version empfohlen, z.B. v18 oder höher)
- [pnpm](https://pnpm.io/installation) (Package Manager)
- [Git](https://git-scm.com/)
- **(Potenziell für `sqlite3`) Build Tools:** Auf manchen Systemen werden C++ Compiler und Python benötigt, um native Abhängigkeiten wie `sqlite3` zu bauen.
  - **Debian/Ubuntu:** `sudo apt update && sudo apt install -y build-essential python3 make g++`
  - **macOS:** Xcode Command Line Tools (`xcode-select --install`)
  - **Windows:** `npm install --global windows-build-tools` (als Administrator) oder Visual Studio mit C++ Build Tools.

## ⚙️ Setup & Installation

1.  **Repository klonen:**
    ```bash
    git clone <repository-url>
    cd join-monorepo
    ```
2.  **Abhängigkeiten installieren:**
    Installiert alle Abhängigkeiten für alle Pakete im Workspace vom Root-Verzeichnis aus.
    ```bash
    pnpm install
    ```
3.  **Geteiltes Paket bauen:**
    Kompiliert den TypeScript-Code im `shared`-Paket, damit er von Frontend und Backend importiert werden kann.
    ```bash
    pnpm run build:shared
    ```
4.  **(Falls `sqlite3` Probleme macht):** Wenn das Backend beim Starten Fehler bezüglich `sqlite3`-Bindings wirft (trotz installierter Build-Tools), versuche Folgendes im Root-Verzeichnis:
    ```bash
    # Erst entfernen
    pnpm remove sqlite3 -F backend
    # Dann neu installieren und Build erzwingen
    pnpm add sqlite3 -F backend --ignore-scripts=false
    ```
    Oder alternativ:
    ```bash
    pnpm rebuild sqlite3 -F backend
    ```

## ▶️ Anwendung starten (Entwicklungsmodus)

Um Frontend und Backend gleichzeitig im Entwicklungsmodus (mit Hot-Reloading) zu starten:

1.  **Führe im Root-Verzeichnis aus:**
    ```bash
    pnpm run dev
    ```
2.  Dies startet:
    - Das **Backend** (mit `nodemon` für automatische Neustarts) normalerweise auf `http://localhost:3000`. Achte auf die Konsolenausgabe `🚀 Backend-Server läuft auf Port 3000`.
    - Das **Frontend** (mit Vite Dev Server) normalerweise auf `http://localhost:5173/`. Öffne diese URL im Browser.

**Individuelles Starten:**

- Nur Frontend: `pnpm --filter frontend dev`
- Nur Backend: `pnpm --filter backend dev`

## 🗄️ Datenbank

- Das Backend verwendet **SQLite**.
- Die Datenbankdatei (`database.sqlite`) wird automatisch im Verzeichnis `packages/backend/db/` erstellt, wenn der Backend-Server das erste Mal startet und die Sequelize-Synchronisation (`sequelize.sync()`) erfolgreich ist.
- Um die Datenbank zurückzusetzen (Daten löschen und Tabellen neu erstellen):
  1.  Stoppe das Backend.
  2.  Lösche die Datei `packages/backend/db/database.sqlite`.
  3.  Ändere in `packages/backend/src/server.js` kurzzeitig `sequelize.sync({ force: false })` zu `sequelize.sync({ force: true })`.
  4.  Starte das Backend neu (`pnpm --filter backend dev`). Die Tabellen werden neu erstellt.
  5.  **WICHTIG:** Ändere es danach wieder zurück zu `sequelize.sync({ force: false })`, um versehentliches Datenlöschen zu vermeiden!

## 📝 TODO / Zukünftige Entwicklung

- Vollständige Implementierung des Task-Erstellungs-/Bearbeitungs-Modals.
- Implementierung der API-Aufrufe im Frontend (Pinia Store) für CRUD-Operationen.
- Implementierung der Benutzer-/Kontaktverwaltung (Frontend & Backend).
- Implementierung der Benutzer-Authentifizierung.
- Ausbau der Offline-Fähigkeiten (Sync-Queue, Konfliktlösung).
- Implementierung von Subtasks.
- Verbesserung der UI/UX basierend auf dem ursprünglichen Design.
- Hinzufügen von Unit- und E2E-Tests.