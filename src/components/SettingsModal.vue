<script setup lang="ts">
import { ref } from "vue";
import Toggle from "@vueform/toggle";

interface Settings {
  shiftHours: number;
  maxDaysInWeek: number;
  enableMondays: boolean;
}

const props = defineProps<Settings>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "save", value: Settings): void;
}>();

const newShiftHours = ref(props.shiftHours);
const newMaxDaysInWeek = ref(props.maxDaysInWeek);
const newEnableMondays = ref(props.enableMondays);

const cancel = () => {
  emit("cancel");
  newShiftHours.value = props.shiftHours;
  newMaxDaysInWeek.value = props.maxDaysInWeek;
  newEnableMondays.value = props.enableMondays;
};

const save = () => {
  const value = {
    shiftHours: newShiftHours.value,
    maxDaysInWeek: newMaxDaysInWeek.value,
    enableMondays: newEnableMondays.value,
  };
  emit("save", value);
};
</script>

<template>
  <div class="settings-modal">
    <div class="settings">
      <div class="row">
        <label for="shift-hours">Długość zmiany w godzinach</label>
        <input
          type="number"
          name="shift-hours"
          min="1"
          max="72"
          v-model="newShiftHours"
        />
      </div>
      <div class="row">
        <label for="max-days-in-week">Max dni w ciągu tygodnia</label>
        <input
          type="number"
          name="max-days-in-week"
          min="1"
          max="7"
          v-model="newMaxDaysInWeek"
        />
      </div>
      <div class="row">
        <label for="enable-mondays">Włącz poniedziałki</label
        ><Toggle v-model="newEnableMondays" name="enable-mondays" />
      </div>
    </div>
    <footer>
      <span class="icon-clear" v-wave @click="cancel"></span>
      <span class="icon-save" v-wave @click="save"></span>
    </footer>
  </div>
</template>

<style scoped>
.settings-modal {
  position: fixed;
  width: 100%;
  height: 30%;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background-color: #fff;
}

.settings-modal .settings {
  max-width: 330px;
  margin: 0 auto;
  padding-top: 10px;
}

.settings-modal .row {
  border: 0;
}
.settings-modal .row:not(:last-child) {
  border-bottom: solid 1px #cbd5e0;
}

.toggle-container {
  margin-right: 10px;
}
</style>