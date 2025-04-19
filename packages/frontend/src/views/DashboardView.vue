<template>
  <div class="dashboard-view">
    <h1>Dashboard</h1>
    <p v-if="taskStore.isLoading">Lade Tasks...</p>
    <p v-if="taskStore.error" class="error-message">{{ taskStore.error }}</p>

    <div v-if="!taskStore.isLoading && !taskStore.error" class="dashboard-grid">
      <DashboardBox
        label="Tasks im Board"
        :value="taskStore.totalTaskCount"
        valueType="raw"
        icon="/path/to/your/board-icon.svg"
        actionIcon="/path/to/your/arrow-right-icon.svg"
        @click="navigateToBoard"
      />

      <DashboardBox
        label="Tasks mit Priorität: Hoch"
        :value="taskStore.urgentTaskCount"
        valueType="raw"
        icon="/path/to/your/urgent-icon.svg"
        actionIcon="/path/to/your/arrow-right-icon.svg"
         @click="navigateToBoard"
      />

       <DashboardBox
        label="Nächstes Fälligkeitsdatum"
        :value="taskStore.nextDueDate"
        valueType="date"
        icon="/path/to/your/calendar-icon.svg" 
        actionIcon="/path/to/your/arrow-right-icon.svg"
         @click="navigateToBoard"
      />

      <DashboardBox
        label="Tasks ToDo"
        :value="todoTaskCount"
        valueType="raw"
        icon="/path/to/your/todo-icon.svg" 
        actionIcon="/path/to/your/arrow-right-icon.svg"
         @click="navigateToBoard"
      />
       <DashboardBox
        label="Tasks in Bearbeitung"
        :value="inProgressTaskCount"
        valueType="raw"
        icon="/path/to/your/progress-icon.svg" 
        actionIcon="/path/to/your/arrow-right-icon.svg"
         @click="navigateToBoard"
      />
       <DashboardBox
        label="Tasks erledigt"
        :value="doneTaskCount"
        valueType="raw"
        icon="/path/to/your/done-icon.svg"
        actionIcon="/path/to/your/arrow-right-icon.svg"
         @click="navigateToBoard"
      />


    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from '@/stores/tasks'; // Pfad anpassen, falls nötig
import DashboardBox from '@/components/DashboardBox.vue'; // Pfad anpassen, falls nötig
// Stelle sicher, dass TaskState importiert ist, falls du es hier verwendest
import { TaskState } from '../../../shared/src/types/Task'; // Pfad prüfen!

const taskStore = useTaskStore();
const router = useRouter();

// Daten laden, wenn die Komponente gemountet wird
onMounted(() => {
  // Nur laden, wenn noch keine Tasks da sind, um doppeltes Laden zu vermeiden
  if (taskStore.tasks.length === 0) {
    taskStore.fetchTasks();
  }
});

// Beispiel: Getter für spezifische Status direkt im View nutzen (oder in Pinia definieren)
const todoTaskCount = computed(() => taskStore.getTasksByState(TaskState.ToDo).length);
const inProgressTaskCount = computed(() => taskStore.getTasksByState(TaskState.InProgress).length);
const doneTaskCount = computed(() => taskStore.getTasksByState(TaskState.Done).length);
// const awaitingFeedbackTaskCount = computed(() => taskStore.getTasksByState(TaskState.AwaitingFeedback).length);


// Navigation zum Board (Beispiel)
const navigateToBoard = () => {
  router.push('/board'); // Passe den Pfad ggf. an deine Router-Konfiguration an
};
</script>

<style scoped>
.dashboard-view {
  padding: 20px;
   max-width: 1200px;
   margin: 0 auto; /* Zentriert das Dashboard */
}

.dashboard-grid {
  display: grid;
  /* Erzeugt 3 Spalten auf größeren Bildschirmen */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px; /* Abstand zwischen den Boxen */
  margin-top: 20px;
}

.error-message {
    color: red;
    font-weight: bold;
}

/* Beispiel für Responsiveness: Auf kleinen Bildschirmen nur eine Spalte */
@media (max-width: 600px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>