# Join-Mono

## Projektbeschreibung

`Join-Mono` ist ein Monorepo, das eine Full-Stack-Anwendung beherbergt. Es besteht aus einem Backend (Node.js), einem Frontend (Vue.js) und einem gemeinsamen Paket für geteilte Typdefinitionen und Schnittstellen. Das Projekt ist darauf ausgelegt, eine effiziente Entwicklung und Verwaltung von miteinander verbundenen Diensten zu ermöglichen.

## Funktionen

*   **Backend:** Robuste API-Endpunkte für Datenverwaltung (z.B. Aufgaben).
*   **Frontend:** Interaktive Benutzeroberfläche zur Anzeige und Verwaltung von Daten.
*   **Shared:** Gemeinsame TypeScript-Typen und Schnittstellen zur Sicherstellung der Konsistenz zwischen Frontend und Backend.
*   **Monorepo-Struktur:** Vereinfacht die Abhängigkeitsverwaltung und Code-Wiederverwendung über verschiedene Pakete hinweg.

## Technologien

### Backend
*   Node.js
*   Express.js (vermutlich, basierend auf `server.js` und `controllers`)
*   TypeScript (für Controller)
*   JavaScript (für Models und Server)

### Frontend
*   Vue.js
*   Vite (Build-Tool)
*   JavaScript

### Shared
*   TypeScript

### Monorepo-Management
*   pnpm (basierend auf `pnpm-lock.yaml` und `pnpm-workspace.yaml`)

## Erste Schritte

Um das Projekt lokal einzurichten und auszuführen, folge diesen Schritten:

### Voraussetzungen

Stelle sicher, dass du `Node.js` und `pnpm` installiert hast.

*   **Node.js:** [https://nodejs.org/](https://nodejs.org/)
*   **pnpm:** [https://pnpm.io/](https://pnpm.io/)

### Installation

1.  Klone das Repository:
    ```bash
    git clone https://github.com/dein-benutzername/join-mono.git
    cd join-mono
    ```

2.  Installieren der Abhängigkeiten für alle Pakete im Monorepo:
    ```bash
    pnpm install
    ```

### Ausführen der Anwendung

#### Backend starten

Navigiere in das Backend-Verzeichnis und starte den Server:
```bash
cd packages/backend
node src/server.js # Oder der entsprechende Startbefehl, z.B. `npm start` oder `pnpm start`
```
*Hinweis: Überprüfe die `package.json` im `backend`-Verzeichnis für den genauen Startbefehl.*

#### Frontend starten

Navigiere in das Frontend-Verzeichnis und starte die Entwicklungsserver:
```bash
cd packages/frontend
pnpm dev # Oder der entsprechende Startbefehl, z.B. `npm run dev`
```
Die Frontend-Anwendung sollte dann unter `http://localhost:5173` (oder einem anderen von Vite zugewiesenen Port) verfügbar sein.

## Projektstruktur

```
.
├── packages/
│   ├── backend/          # Node.js Backend-Anwendung
│   │   ├── src/          # Quellcode des Backends
│   │   │   ├── server.js
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   └── models/
│   │   └── ...
│   ├── frontend/         # Vue.js Frontend-Anwendung
│   │   ├── src/          # Quellcode des Frontends
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── router/
│   │   │   ├── stores/
│   │   │   └── views/
│   │   └── ...
│   └── shared/           # Gemeinsame Typdefinitionen und Schnittstellen
│       ├── src/
│       │   └── types/    # TypeScript-Typen (z.B. Task.ts, User.ts)
│       └── ...
├── .gitignore
├── package.json          # Monorepo-Root-Paketkonfiguration
├── pnpm-lock.yaml        # pnpm Lock-Datei
├── pnpm-workspace.yaml   # pnpm Workspace-Konfiguration
└── README.md             # Diese Datei
```

## Mitwirken

Beiträge sind willkommen! Bitte beachte die folgenden Richtlinien:
1.  Forke das Repository.
2.  Erstelle einen neuen Branch für deine Änderungen.
3.  Stelle sicher, dass dein Code den bestehenden Stilrichtlinien entspricht.
4.  Erstelle einen Pull Request mit einer klaren Beschreibung deiner Änderungen.

## Lizenz

Dieses Projekt ist unter der [LICENSE](LICENSE)-Datei lizenziert.
