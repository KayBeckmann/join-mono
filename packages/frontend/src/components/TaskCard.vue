<template>
    <div
      class="task-card"
      draggable="true"
      @dragstart="onDragStart"
      @click="emit('viewTask', task)"
    >
      <div v-if="task.category" class="category-indicator" :style="{ backgroundColor: task.category.color }">
        {{ task.category.name }}
      </div>
      <h4 class="task-title">{{ task.title }}</h4>
      <p v-if="task.description" class="task-description">{{ truncatedDescription }}</p>
      <div class="task-footer">
          <span class="priority">{{ priorityText }}</span>
          </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, computed } from 'vue';
  // Importiere Typen und Enums
  // Passe den Pfad ggf. an deine Struktur/Aliase an
  import { TaskPriority } from '../../../shared/src/types/Task';
  
  const props = defineProps({
    task: {
      type: Object, // Sollte dem Task Interface entsprechen
      required: true,
    }
  });
  
  // Emit-Event definieren, um den Klick an die Parent-Komponente zu melden
  const emit = defineEmits(['viewTask']);
  
  // Funktion, die beim Starten des Drag-Vorgangs aufgerufen wird
  const onDragStart = (event) => {
    // Speichere die ID des gezogenen Tasks im DataTransfer-Objekt
    // Das ist wichtig, damit die Drop-Zone weiß, welcher Task verschoben wird
    event.dataTransfer.setData('text/plain', props.task.id);
    event.dataTransfer.dropEffect = 'move'; // Visuelles Feedback
    console.log('Dragging task:', props.task.id);
  };
  
  // Berechnete Eigenschaft für die Priorität als Text
  const priorityText = computed(() => {
      switch(props.task.priority) {
          case TaskPriority.Urgent: return 'Hoch';
          case TaskPriority.Medium: return 'Mittel';
          case TaskPriority.Low: return 'Niedrig';
          default: return '';
      }
  });
  
  // Berechnete Eigenschaft für eine gekürzte Beschreibung
  const truncatedDescription = computed(() => {
      const maxLength = 80; // Maximale Länge
      if (props.task.description && props.task.description.length > maxLength) {
          return props.task.description.substring(0, maxLength) + '...';
      }
      return props.task.description;
  });
  
  </script>
  
  <style scoped>
  .task-card {
    background-color: white;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: grab; /* Für Drag & Drop */
    border: 1px solid #e0e0e0;
    transition: box-shadow 0.2s ease-in-out;
  }
  .task-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  .task-card:active {
      cursor: grabbing;
  }
  
  .category-indicator {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      color: white;
      margin-bottom: 10px;
      font-weight: 500;
  }
  
  .task-title {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 0;
    margin-bottom: 8px;
  }
  
  .task-description {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 12px;
    line-height: 1.4;
  }
  
  .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8rem;
      color: #888;
      margin-top: 10px;
  }
  .priority {
      font-weight: 500;
  }
  </style>