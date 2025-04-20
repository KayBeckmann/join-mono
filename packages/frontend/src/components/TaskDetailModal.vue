<template>
    <div class="modal-overlay" @click.self="emit('close')">
      <div class="modal-content">
        <button class="close-button" @click="emit('close')">&times;</button>
        <h2>{{ modalTitle }}</h2>
  
        <div v-if="isLoading">Lade Task-Details...</div>
        <div v-else>
          <form @submit.prevent="saveChanges">
              <p>Task ID: {{ taskId ?? 'Wird erstellt' }}</p>
              <p>Formular Platzhalter</p>
              <div>
                  <label for="taskTitle">Titel:</label>
                  <input type="text" id="taskTitle" v-model="editableTask.title">
              </div>
              <div class="modal-actions">
                  <button type="button" @click="emit('close')">Abbrechen</button>
                  <button type="submit">{{ isCreating ? 'Erstellen' : 'Speichern' }}</button>
              </div>
          </form>
        </div>
  
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, watch, onMounted } from 'vue';
  import { useTaskStore } from '@/stores/tasks'; // Pfad anpassen
  
  const props = defineProps({
    taskId: { // UUID des zu bearbeitenden Tasks oder null für neuen Task
      type: String,
      default: null,
    },
    isCreating: { // Flag, ob ein neuer Task erstellt wird
        type: Boolean,
        default: false,
    }
  });
  
  const emit = defineEmits(['close', 'save', 'create']);
  
  const taskStore = useTaskStore();
  const isLoading = ref(false);
  const editableTask = ref({ // Lokaler Zustand für Formular
      title: '',
      description: '',
      priority: null, // TaskPriority Enum Wert
      category: null, // Category Objekt
      assignedTo: [], // Array von User UUIDs
      dueDate: null, // Date Objekt oder Timestamp
      state: null, // TaskState Enum Wert
      // id und subtasks werden hier nicht direkt bearbeitet
  });
  
  const modalTitle = computed(() => props.isCreating ? 'Neuen Task erstellen' : 'Task bearbeiten');
  
  // Lade Taskdaten, wenn sich taskId ändert (nur beim Bearbeiten)
  watch(() => props.taskId, (newId) => {
    if (newId && !props.isCreating) {
      loadTaskDetails(newId);
    } else if (props.isCreating) {
        resetForm(); // Formular für neuen Task zurücksetzen
    }
  }, { immediate: true }); // Auch beim initialen Laden prüfen
  
  // Funktion zum Laden der Task-Details aus dem Store
  const loadTaskDetails = (id) => {
    isLoading.value = true;
    const taskFromStore = taskStore.tasks.find(t => t.id === id);
    if (taskFromStore) {
      // Kopiere Daten in den lokalen Zustand (wichtig, um Store nicht direkt zu mutieren)
      editableTask.value = { ...taskFromStore };
       // Konvertiere dueDate Timestamp zu Date Objekt für <input type="date"> falls nötig
       if (editableTask.value.dueDate) {
           editableTask.value.dueDate = new Date(editableTask.value.dueDate).toISOString().split('T')[0];
       }
    } else {
      console.error(`Task ${id} nicht im Store gefunden!`);
      // Ggf. Fehler anzeigen oder Modal schließen
      emit('close');
    }
    isLoading.value = false;
  };
  
  // Funktion zum Zurücksetzen des Formulars für neue Tasks
  const resetForm = () => {
      editableTask.value = {
          title: '',
          description: '',
          priority: null,
          category: null,
          assignedTo: [],
          dueDate: null,
          state: null, // Wird ggf. bei Erstellung gesetzt
      };
  }
  
  // Funktion zum Speichern der Änderungen
  const saveChanges = () => {
      // Konvertiere Datum zurück zu Timestamp falls nötig
      const dataToSend = { ...editableTask.value };
       if (dataToSend.dueDate) {
           dataToSend.dueDate = new Date(dataToSend.dueDate).getTime();
       }
  
      if (props.isCreating) {
          // Entferne Felder, die nicht Teil des "neuen Task"-Datenobjekts sind
          // (id wird im Store/Backend gesetzt)
          const { id, ...newTaskData } = dataToSend;
          emit('create', newTaskData);
      } else {
          // Sende nur die relevanten Felder zum Update
          // (id wird über props.taskId an Store übergeben)
           const { id, ...updateData } = dataToSend;
          emit('save', updateData);
      }
  };
  
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Über anderen Elementen */
  }
  
  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    min-width: 300px;
    max-width: 600px; /* Beispielbreite */
    width: 90%;
    position: relative;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  }
  
  .close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #888;
  }
  .close-button:hover {
      color: #333;
  }
  
  .modal-actions {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
  }
  /* Basis Formular Styling */
  form div {
      margin-bottom: 15px;
  }
  label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
  }
  input[type="text"], textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box; /* Verhindert Überlaufen */
  }
  </style>