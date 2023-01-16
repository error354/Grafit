<script setup lang="ts">
import { ref, computed } from "vue";

const maxHours = ref<number>(168);
const shiftHours = ref<number>(10);
const maxDaysInWeek = ref<number>(4);

const hoursLeft = computed(() =>
  Math.max(0, maxHours.value - shiftHours.value * selected.value.length)
);

interface Day {
  id: string;
  date: any;
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

const warnings = ref<Array<Warning>>([]);

const addWarning = (warningId: string) => {
  if (!warnings.value.find((warning) => warning.id === warningId)) {
    switch (warningId) {
      case "MAX_DAYS_EXCEEDED":
        warnings.value.push({
          id: "MAX_DAYS_EXCEEDED",
          message: `Wybrano więcej niż ${maxDaysInWeek.value} dni w ciągu tygodnia`,
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

const onDayClick = (day: Day) => {
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
  const weekLater = new Date().setDate(day.date.getDate() + 6);
  const daysBetween = selected.value.filter(
    (s) =>
      s.date.valueOf() >= day.date.valueOf() && s.date.valueOf() < weekLater
  );
  return (daysBetween as Array<Day>).length;
};
</script>

<template>
  <main>
    <h2>Grafikator v0.2 alpha</h2>
    <div class="settings">
      <div class="row">
        <label for="max-hours">Godzin pracujących w miesiącu</label>
        <input
          type="number"
          name="max-hours"
          min="1"
          max="744"
          :value="maxHours"
        />
      </div>
      <div class="row">
        <label for="shift-hours">Długość zmiany w godzinach</label>
        <input
          type="number"
          name="shift-hours"
          min="1"
          max="72"
          :value="shiftHours"
        />
      </div>
      <div class="row">
        <label for="max-days-in-week">Max dni w ciągu tygodnia</label>
        <input
          type="number"
          name="max-days-in-week"
          min="1"
          max="7"
          :value="maxDaysInWeek"
        />
      </div>
    </div>
    <span class="hours-left"
      >Do zaplanowania pozostało {{ hoursLeft }} godzin.</span
    >
    <v-calendar
      :attributes="attributes"
      :min-date="minDate"
      :max-date="maxDate"
      @dayclick="onDayClick"
      color="yellow"
      is-expanded
    />
    <div class="warnings">
      <div class="warning" v-for="warning in warnings" v-bind:key="warning.id">
        {{ warning.message }}
      </div>
    </div>
    <footer>
      <span class="icon-settings" v-wave></span>
      <span class="icon-refresh" v-wave></span>
    </footer>
  </main>
</template>

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

footer {
  width: 100%;
  height: 50px;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: stretch;
  align-content: stretch;
  border-top: 1px solid #cbd5e0;
  font-size: 30px;
}

footer span {
  display: block;
  flex: 1;
  height: 100%;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}

footer span:not(:first-child) {
  border-left: 1px solid #cbd5e0;
}

.settings {
  width: 100%;
  margin: 5px 0 10px 0;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  height: 40px;
}

.row {
  border-bottom: solid 1px #cbd5e0;
}

.settings input {
  width: 70px;
  height: 25px;
  padding: 5px;
}

input {
  border-radius: 5px;
  border: 1px solid #cbd5e0;
}

input:focus {
  border: 1px solid gold;
  outline: 1px solid gold;
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
}
</style>
