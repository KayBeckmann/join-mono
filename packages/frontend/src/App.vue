<script setup>
// Importiere ggf. Header- und Navbar-Komponenten, wenn du sie hier platzierst
// import AppHeader from './components/AppHeader.vue'; // Pfad anpassen
// import NavBar from './components/NavBar.vue'; // Pfad anpassen

// Importiere die RouterView Komponente von vue-router
import { RouterView } from 'vue-router'

</script>

<template>
  <div id="app-container">
    <div class="main-content-area">
      <main class="view-container">
         <RouterView />
      </main>
    </div>

     </div>
</template>

<style scoped>
/* Basis-Styling für das App-Layout (optional) */
#app-container {
  display: flex;
  flex-direction: column; /* Standard: Header oben */
  min-height: 100vh;
}

.main-content-area {
  display: flex;
  flex-grow: 1;
  /* Beispiel für Desktop-Layout mit seitlicher Navbar */
  /* Wenn du eine seitliche Navbar hast: */
  /* > .navbar-component { flex-shrink: 0; width: var(--nav-width-d); } */
  /* > .view-container { flex-grow: 1; overflow-y: auto; padding: ...; } */
}

.view-container {
   padding: 20px; /* Beispiel-Padding für den Inhaltsbereich */
   flex-grow: 1;
   /* Ggf. weitere Stile, um Padding/Margin von Header/Navbar zu berücksichtigen */
}

/* Entferne oder passe das Standard-Vite-Logo-Styling an */
/*
.logo { ... }
.logo:hover { ... }
.logo.vue:hover { ... }
*/
</style>