<template>
    <div class="board-view">
      <h1>Kanban Board</h1>
       <button @click="openCreateTaskModal">Neuen Task erstellen</button> <div v-if="taskStore.isLoading && taskStore.tasks.length === 0">Lade Tasks...</div>
      <div v-if="taskStore.error" class="error-message">{{ taskStore.error }}</div>
      <div v-if="taskStore.isSyncing" class="sync-indicator">Synchronisiere mit Backend...</div>
  
      <div v-if="!taskStore.isLoading || taskStore.tasks.length > 0" class="board-columns">
        <div
          v-for="status in columnStatuses"
          :key="status.value"
          class="board-column"
          @dragover.prevent 
          @dragenter.prevent
          @drop="onDrop($event, status.value)"
        >
          <h3 class="column-title">{{ status.title }}</h3>
          <div class="task-list">
            <TaskCard
              v-for="task in taskStore.getTasksByState(status.value)"
              :key="task.id"
              :task="task"
              @viewTask="openTaskModal"
            />
            <div v-if="taskStore.getTasksByState(status.value).length === 0" class="empty-column-placeholder">
                  Keine Tasks hier.
             </div>
          </div>
        </div>
      </div>
  
      <TaskDetailModal
          v-if="isModalOpen"
          :task-id="selectedTaskId"
          :is-creating="isCreatingTask"
          @close="closeTaskModal"
          @save="handleSaveTask"
          @create="handleCreateTask"
       />
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useTaskStore } from '@/stores/tasks'; // Pfad anpassen
  import TaskCard from '@/components/TaskCard.vue'; // Pfad anpassen
  import TaskDetailModal from '@/components/TaskDetailModal.vue'; // Pfad anpassen (noch erstellen!)
  // Importiere das TaskState Enum
  import { TaskState } from '../../../shared/src/types/Task'; // Pfad prüfen!
  
  const taskStore = useTaskStore();
  
  // Definiere die Spalten basierend auf dem TaskState Enum
  const columnStatuses = ref([
    { value: TaskState.ToDo, title: 'To Do' },
    { value: TaskState.InProgress, title: 'In Bearbeitung' },
    { value: TaskState.AwaitingFeedback, title: 'Wartet auf Feedback' },
    { value: TaskState.Done, title: 'Erledigt' },
  ]);
  
  // Lade Tasks, wenn die Komponente geladen wird
  onMounted(() => {
    taskStore.fetchTasks();
  });
  
  // Drag & Drop Handler
  const onDrop = (event, targetStatus) => {
    // Hole die Task-ID, die wir in onDragStart gespeichert haben
    const taskId = event.dataTransfer.getData('text/plain');
    console.log(`Dropped task ${taskId} onto column ${targetStatus}`);
  
    // Finde den Task, um den aktuellen Status zu prüfen (optional, aber gut)
    const droppedTask = taskStore.tasks.find(t => t.id === taskId);
  
    if (droppedTask && droppedTask.state !== targetStatus) {
      // Rufe die Store-Action auf, um den Status zu ändern (speichert in Dexie)
      taskStore.updateTaskState(taskId, targetStatus);
    } else {
        console.log(`Task ${taskId} ist bereits in Status ${targetStatus} oder wurde nicht gefunden.`);
    }
  };
  
  // ---- Modal Handling ----
  const isModalOpen = ref(false);
  const selectedTaskId = ref(null);
  const isCreatingTask = ref(false); // Um zwischen Editieren und Erstellen zu unterscheiden
  
  // Öffnet das Modal zur Detailansicht/Bearbeitung
  const openTaskModal = (task) => {
    console.log("Opening modal for task:", task.id);
    selectedTaskId.value = task.id;
    isCreatingTask.value = false; // Wir bearbeiten einen vorhandenen Task
    isModalOpen.value = true;
  };
  
  // Öffnet das Modal zum Erstellen eines neuen Tasks
  const openCreateTaskModal = () => {
      console.log("Opening modal to create task");
      selectedTaskId.value = null; // Keine ID beim Erstellen
      isCreatingTask.value = true; // Wir erstellen einen neuen Task
      isModalOpen.value = true;
  }
  
  // Schließt das Modal
  const closeTaskModal = () => {
    isModalOpen.value = false;
    selectedTaskId.value = null;
    isCreatingTask.value = false;
  };
  
  // Wird aufgerufen, wenn im Modal auf "Speichern" geklickt wird (Bearbeiten)
  const handleSaveTask = (updatedTaskData) => {
      console.log("Saving task:", selectedTaskId.value, updatedTaskData);
      if (selectedTaskId.value) {
          taskStore.updateTask(selectedTaskId.value, updatedTaskData); // Ruft Store Action auf
      }
      closeTaskModal();
  };
  
  // Wird aufgerufen, wenn im Modal auf "Erstellen" geklickt wird
  const handleCreateTask = (newTaskData) => {
      console.log("Creating task:", newTaskData);
      taskStore.addTask(newTaskData); // Ruft Store Action auf
      closeTaskModal();
  }
  
  </script>
  
  <style scoped>
  .board-view {
    padding: 20px;
  }
  
  .board-columns {
    display: flex;
    gap: 20px;
    overflow-x: auto; /* Horizontales Scrollen bei vielen Spalten */
    padding-bottom: 15px; /* Platz für Scrollbar */
  }
  
  .board-column {
    flex: 1; /* Jede Spalte versucht, gleich breit zu sein */
    min-width: 280px; /* Mindestbreite einer Spalte */
    background-color: #f4f5f7; /* Heller Hintergrund für Spalten */
    border-radius: 5px;
    padding: 15px;
    /* Höhe passt sich dem Inhalt an, aber ggf. min-height setzen */
  }
  
  .column-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 15px;
    color: #172b4d;
  }
  
  .task-list {
      min-height: 100px; /* Damit man auch in leere Spalten droppen kann */
  }
  
  .empty-column-placeholder {
      text-align: center;
      padding: 20px;
      color: #7a869a;
      font-style: italic;
      border: 2px dashed #dfe1e6;
      border-radius: 3px;
      margin-top: 10px;
  }
  
  .sync-indicator {
      margin-bottom: 10px;
      padding: 5px 10px;
      background-color: #e3fcef;
      color: #006644;
      border-radius: 3px;
      display: inline-block;
  }
  .error-message {
      color: red;
      font-weight: bold;
  }
  button { /* Temporäres Styling für den Button */
      margin-bottom: 15px;
      padding: 8px 15px;
      cursor: pointer;
  }
  </style>