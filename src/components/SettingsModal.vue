<script setup lang="ts">
import { ref } from "vue";
import Toggle from "@vueform/toggle";

interface Settings {
  shiftHours: number;
  maxDaysInWeek: number;
  enableMondays: boolean;
  darkTheme: boolean;
}

const props = defineProps<Settings>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "save", value: Settings): void;
}>();

const shiftHours = ref(props.shiftHours);
const maxDaysInWeek = ref(props.maxDaysInWeek);
const enableMondays = ref(props.enableMondays);
const darkTheme = ref(props.darkTheme);

const cancel = () => {
  emit("cancel");
  shiftHours.value = props.shiftHours;
  maxDaysInWeek.value = props.maxDaysInWeek;
  enableMondays.value = props.enableMondays;
  darkTheme.value = props.darkTheme;
};

const save = () => {
  const value = {
    shiftHours: shiftHours.value,
    maxDaysInWeek: maxDaysInWeek.value,
    enableMondays: enableMondays.value,
    darkTheme: darkTheme.value,
  };
  emit("save", value);
};
</script>

<template>
  <div class="modal settings-modal">
    <div class="settings">
      <div class="row">
        <label for="shift-hours">Długość zmiany w godzinach</label>
        <input
          type="number"
          name="shift-hours"
          min="1"
          max="72"
          v-model="shiftHours"
        />
      </div>
      <div class="row">
        <label for="max-days-in-week">Max dni w ciągu tygodnia</label>
        <input
          type="number"
          name="max-days-in-week"
          min="1"
          max="7"
          v-model="maxDaysInWeek"
        />
      </div>
      <div class="row">
        <label for="enable-mondays">Włącz poniedziałki</label
        ><Toggle v-model="enableMondays" name="enable-mondays" />
      </div>
      <div class="row">
        <label for="dark-theme">Tryb ciemny</label
        ><Toggle v-model="darkTheme" name="dark-theme" />
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
  height: 225px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
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
  border-bottom: solid 1px var(--borders-color);
}

.toggle-container {
  margin-right: 10px;
}
</style>
