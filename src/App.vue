<script setup lang="ts">
import { ref, computed } from "vue";
import SettingsModal from "./components/SettingsModal.vue";
import html2canvas from "html2canvas";

const saveToLocalStorage = (key: string, data: unknown) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const getFromLocalStorage = (key: string) => {
  return JSON.parse(localStorage.getItem(key) as string);
};

const maxHours = ref<number>(getFromLocalStorage("maxHours") || 168);
const shiftHours = ref<number>(getFromLocalStorage("shiftHours") || 10);
const maxDaysInWeek = ref<number>(getFromLocalStorage("maxDaysInWeek") || 4);
const enableMondays = ref<boolean>(
  getFromLocalStorage("enableMondays") || false
);

const hoursLeft = computed(() =>
  Math.max(0, maxHours.value - shiftHours.value * selected.value.length)
);

interface Day {
  id: string;
  date: Date;
}
interface Warning {
  id: string;
  message: string;
}

const selected = ref<Array<Day>>([]);
const selectedDates = computed(() => selected.value.map((day) => day.date));
const attributes = computed(() =>
  selectedDates.value.map((date) => ({
    highlight: true,
    dates: date,
  }))
);

const saveMaxHours = () => {
  saveToLocalStorage("maxHours", maxHours.value);
};

const warnings = ref<Array<Warning>>([]);

const addWarning = (warningId: string) => {
  if (!warnings.value.find((warning) => warning.id === warningId)) {
    switch (warningId) {
      case "MAX_DAYS_EXCEEDED":
        warnings.value.push({
          id: "MAX_DAYS_EXCEEDED",
          message: `Wybrano więcej niż ${maxDaysInWeek.value} dni w ciągu tygodnia.`,
        });
        break;
      default:
        console.error(`Unknown warning type: ${warningId}.`);
    }
  }
};

const calcMinDate = (day: Day) => {
  const minDate = new Date(day.date.getFullYear(), day.date.getMonth(), 1);
  return minDate;
};

const calcMaxDate = (day: Day) => {
  const maxDate = new Date(day.date.getFullYear(), day.date.getMonth() + 1, 0);
  return maxDate;
};

const minDate = computed(() => {
  if (selected.value.length) {
    return calcMinDate(selected.value[0]);
  }
  return null;
});

const maxDate = computed(() => {
  if (selected.value.length) {
    return calcMaxDate(selected.value[0]);
  }
  return null;
});

const removeWarning = (warningId: string) => {
  warnings.value = warnings.value.filter((warning) => warning.id != warningId);
};

interface CalendarDay extends Day {
  isDisabled: boolean;
}

const onDayClick = (day: CalendarDay) => {
  if (day.isDisabled) {
    return false;
  }
  const idx = selected.value.findIndex((d) => d.id === day.id);
  if (idx >= 0) {
    selected.value.splice(idx, 1);
  } else if (hoursLeft.value > 0) {
    selected.value.push({
      id: day.id,
      date: day.date,
    });
  }
  selected.value.sort((a, b) => a.id.localeCompare(b.id));
  let maxDaysExceeded = false;
  for (const s of selected.value) {
    const daysInWeek = calcDaysInWeek(s);
    if (daysInWeek > maxDaysInWeek.value) {
      maxDaysExceeded = true;
      break;
    }
  }
  if (maxDaysExceeded) {
    addWarning("MAX_DAYS_EXCEEDED");
  } else {
    removeWarning("MAX_DAYS_EXCEEDED");
  }
};

const calcDaysInWeek = (day: Day) => {
  const weekLater = day.date.valueOf() + 518400000;
  const daysBetween = selected.value.filter(
    (s) =>
      s.date.valueOf() >= day.date.valueOf() && s.date.valueOf() <= weekLater
  );
  return (daysBetween as Array<Day>).length;
};

const resetSelected = () => {
  selected.value = [];
};

const settingsVisible = ref(false);

interface Settings {
  shiftHours: number;
  maxDaysInWeek: number;
  enableMondays: boolean;
  darkTheme: boolean;
}

const saveSettings = (newSettings: Settings) => {
  shiftHours.value = newSettings.shiftHours;
  saveToLocalStorage("shiftHours", newSettings.shiftHours);
  maxDaysInWeek.value = newSettings.maxDaysInWeek;
  saveToLocalStorage("maxDaysInWeek", newSettings.maxDaysInWeek);
  enableMondays.value = newSettings.enableMondays;
  saveToLocalStorage("enableMondays", newSettings.enableMondays);
  if (newSettings.darkTheme) {
    setTheme("dark");
  } else {
    setTheme("light");
  }
  settingsVisible.value = false;
};

/* LIGHT/DARK THEME */
const userTheme = ref("light");

const darkTheme = computed(() => {
  if (userTheme.value === "dark") {
    return true;
  }
  return false;
});

const setTheme = (theme: string) => {
  saveToLocalStorage("user-theme", theme);
  userTheme.value = theme;
  document.documentElement.className = theme;
};

const getMediaPreference = () => {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (hasDarkPreference) {
    return "dark";
  } else {
    return "light";
  }
};

const getTheme = () => {
  return getFromLocalStorage("user-theme");
};

const initUserTheme = getTheme() || getMediaPreference();
setTheme(initUserTheme);

/* SCREENSHOTS */

const calendar = ref(null);

const getVisibleMonth = () => {
  const titleElement: HTMLElement | null = document.querySelector(".vc-title");
  const titleText = (titleElement as HTMLElement).textContent;
  const splited = (titleText as string).split(" 2");
  const monthName = splited[0];
  return monthName;
};

const takeScreenshot = async () => {
  const calendarElement: HTMLElement | null =
    document.querySelector(".vc-container");
  const screenshotBase64 = (
    await html2canvas(calendarElement as HTMLElement)
  ).toDataURL();
  return screenshotBase64;
};

const saveScreenshot = async () => {
  const screenshotBase64 = await takeScreenshot();
  const a = document.createElement("a");
  a.href = screenshotBase64;
  a.download = `${getVisibleMonth()}.png`;
  a.click();
  a.remove();
};

const shareScreenshot = async () => {
  const screenshotBase64 = await takeScreenshot();
  const blob = await (await fetch(screenshotBase64)).blob();
  const file = new File([blob], `${getVisibleMonth()}.png`, {
    type: blob.type,
  });
  navigator.share({
    title: "Grafik",
    text: `To jest moja propozycja grafiku na ${getVisibleMonth()}`,
    files: [file],
  });
};
</script>

<template>
  <main>
    <h2>Grafit v1.0.5</h2>
    <div class="settings">
      <div class="row">
        <label for="max-hours">Godzin pracujących w miesiącu</label>
        <input
          type="number"
          name="max-hours"
          min="1"
          max="744"
          v-model="maxHours"
          @change="saveMaxHours"
        />
      </div>
    </div>
    <span class="hours-left"
      >Do zaplanowania pozostało <b>{{ hoursLeft }}</b> godzin.</span
    >
    <v-calendar
      ref="calendar"
      :attributes="attributes"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="enableMondays ? null : { weekdays: [2] }"
      :first-day-of-week="2"
      locale="pl"
      @dayclick="onDayClick"
      color="yellow"
      is-expanded
      :is-dark="userTheme === 'dark' ? true : false"
    />
    <div class="warnings">
      <div class="warning" v-for="warning in warnings" v-bind:key="warning.id">
        {{ warning.message }}
      </div>
    </div>
    <footer>
      <span class="icon-settings" v-wave @click="settingsVisible = true"></span>
      <span
        class="icon-photo_size_select_large"
        v-wave
        @click="saveScreenshot"
      ></span>
      <span class="icon-share" v-wave @click="shareScreenshot"></span>
      <span class="icon-refresh" v-wave @click="resetSelected"></span>
    </footer>
  </main>
  <transition name="fade">
    <div
      class="overlay"
      @click="settingsVisible = false"
      v-show="settingsVisible"
    ></div>
  </transition>
  <transition name="slide-fade">
    <SettingsModal
      :shiftHours="shiftHours"
      :maxDaysInWeek="maxDaysInWeek"
      :enableMondays="enableMondays"
      :darkTheme="darkTheme"
      v-show="settingsVisible"
      @save="saveSettings"
      @cancel="settingsVisible = false"
    />
  </transition>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
<style scoped>
main {
  max-width: 330px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
}

.hours-left {
  margin-bottom: 10px;
}

.warnings {
  width: 100%;
  margin-top: 5px;
}

.warning {
  width: 100%;
  padding: 5px;
  margin: 5px 0;
  background-color: lightpink;
  border: 2px solid red;
  border-radius: 5px;
  color: #1a202c;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 2;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(100%);
  opacity: 0.7;
}

.vc-container {
  --yellow-600: var(--accent-color);
}
</style>
