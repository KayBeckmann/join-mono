<template>
  <div class="dashboard-box">
    <div v-if="icon" class="icon-container">
      <img :src="icon" alt="" class="box-icon" />
    </div>
    <div class="content-container">
      <span class="value">{{ formattedValue }}</span>
      <span class="label">{{ label }}</span>
    </div>
    <div v-if="actionIcon" class="action-container">
       <img :src="actionIcon" alt="" class="action-icon" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

// Props definieren: Wert, Beschriftung und optional Icons
const props = defineProps({
  value: {
    type: [String, Number, Date, null], // Kann Zahl, String oder Datum sein
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  icon: { // Pfad zum Icon (optional)
    type: String,
    default: null,
  },
   actionIcon: { // Pfad zum Action-Icon (optional)
    type: String,
    default: null,
  },
  valueType: { // Gibt an, wie der Wert formatiert werden soll
    type: String,
    default: 'raw', // 'raw', 'date'
  }
});

// Formatierter Wert basierend auf valueType
const formattedValue = computed(() => {
  if (props.value === null || props.value === undefined) {
    return '-'; // Standardanzeige, wenn kein Wert da ist
  }
  if (props.valueType === 'date' && props.value instanceof Date) {
    // Einfache Datumsformatierung (kann durch Bibliotheken wie date-fns erweitert werden)
    const day = String(props.value.getDate()).padStart(2, '0');
    const month = String(props.value.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const year = props.value.getFullYear();
    return `${day}.${month}.${year}`;
  }
  // Gib den Wert direkt zurück für 'raw' oder andere Typen
  return props.value;
});
</script>

<style scoped>
.dashboard-box {
  background-color: white;
  border-radius: 20px; /* Angepasst an summary.css */
  padding: 20px;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.1); /* Angepasst an summary.css */
  display: flex;
  align-items: center;
  justify-content: space-between; /* Icons an den Rändern */
  gap: 15px;
  min-height: 100px; /* Beispielhöhe */
  cursor: pointer;
  transition: all 100ms ease-in-out;
}

.dashboard-box:hover {
  background-color: var(--darkblue); /* Nutzung der CSS Variablen */
  color: var(--white);
  box-shadow: var(--box-shadow-hover);
  transform: scale(1.035);
}

.dashboard-box:hover .box-icon,
.dashboard-box:hover .action-icon {
   filter: brightness(0) invert(1); /* Macht Icons weiß bei Hover */
}


.content-container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Zentriert Text */
    flex-grow: 1; /* Nimmt verfügbaren Platz ein */
    text-align: center;
}

.value {
  font-size: 40px; /* Beispiel */
  font-weight: 600;
  line-height: 1.2;
}

.label {
  font-size: 14px;
  line-height: 1.2;
}

.icon-container, .action-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.box-icon, .action-icon {
    width: 30px; /* Beispielgröße */
    height: 30px; /* Beispielgröße */
    object-fit: contain;
}

/* Optional: Wenn kein Icon da ist, zentriert es besser */
.icon-container:empty, .action-container:empty {
    min-width: 30px; /* Breite des Icons reservieren, auch wenn leer */
}
</style>