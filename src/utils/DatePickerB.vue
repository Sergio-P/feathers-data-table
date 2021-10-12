<template>
  <!-- Date picker -->
  <v-menu
    ref="menu"
    v-model="menu"
    :close-on-content-click="false"
    transition="scale-transition"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :disabled="disabled"
        prepend-icon="mdi-calendar"
        v-model="dateText"
        v-on:input="$emit('input', $event)"
        v-on="on"
        :label="label ? label : 'Fecha'"
        :error="errorStatus || error"
        :hide-details="hideDetails"
        :error-messages="errorMessage === '' ? null : errorMessage"
      />
    </template>
    <v-date-picker
      :disabled="disabled"
      style="display: block"
      v-model="date"
      @input="formatDate"
    />
  </v-menu>
</template>

<script>
import moment from "moment";

function invertDate(dt) {
  if (/\d+-\d+-\d+/.test(dt)) {
    let [d, m, y] = dt.split(" ")[0].split("-");
    return `${y}-${m}-${d}`;
  }
  return null;
}

export default {
  name: "DatePickerB",
  data() {
    return {
      menu: false,
      localDate: null,
      errorDate: [],
      date: null,
      dateText: null,
    };
  },
  watch: {
    value(r) {
      if (r != null) {
        this.date = r;
        this.formatDate(r);
      }
    },
  },
  created() {
    this.initDate();
  },
  methods: {
    emitFunction(event) {
      let split = event.split("-");
      this.dateText = `${split[2]}/${split[1]}/${split[0]}`;
      this.menu = false;
      this.$emit("input", event);
    },
    formatDate() {
      this.dateText = invertDate(this.date);

      this.menu = false;
      this.changedDate();
    },
    changedDate() {
      this.$emit("input", this.date);
    },
    initDate(date) {
      if (!date) {
        date = moment().format("YYYY-MM-DD");
      } else {
        date = invertDate(date);
      }
      this.date = date;
      this.formatDate();
    },
  },
  props: {
    value: String,
    errorStatus: Boolean,
    errorMessage: Object,
    disabled: Boolean,
    hideDetails: Boolean,
    dateInit: {
      type: String,
      allowNull: true,
    },
    label: String,
    error: {
      type: Boolean,
      defaultValue: false,
    },
  },
};
</script>

<style scoped>
</style>
