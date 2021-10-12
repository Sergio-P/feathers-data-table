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
        readonly
        :disabled="disabled"
        prepend-icon="mdi-calendar"
        :value="dateText"
        v-on:input="$emit('input', $event)"
        :error="errorStatus || error"
        v-on="on"
        :label="label"
        :rules="rules"
        :class="classes"
        :error-messages="errorMessage === '' ? null : errorMessage"
      />
    </template>
    <v-date-picker
      v-bind:value="value"
      @input="emitFunction"
      :disabled="disabled"
      style="display: block"
      :type="type"
      v-model="date"
    />
  </v-menu>
</template>

<script>
export default {
  name: "DatePickerB",
  data() {
    return {
      menu: false,
      dateText: null,
    };
  },
  created() {
    if (this.value) {
      let split = this.value.split(" ");
      let months = {
        Enero: 1,
        Febrero: 2,
        Marzo: 3,
        Abril: 4,
        Mayo: 5,
        Junio: 6,
        Julio: 7,
        Agosto: 8,
        Septiembre: 9,
        Octubre: 10,
        Noviembre: 11,
        Diciembre: 12,
      };
      if (months[split[0]] > 0) {
        let m =
          months[split[0]] > 9 ? months[split[0]] : `0${months[split[0]]}`;
        this.value = `${split[1]}-${m}`;
      }
      this.emitFunction(this.value);
    }
  },
  methods: {
    emitFunction(event) {
      if (!event) {
        this.dateText = "";
        return;
      }
      let split = event.split("-");
      if (split.length > 1) {
        this.dateText = `${split[1]}/${split[0]}`;
      }
      if (split.length > 2) {
        this.dateText = `${split[2]}/${split[1]}/${split[0]}`;
      }

      this.menu = false;
      this.$emit("input", event);
    },
  },
  watch: {
    value() {
      this.emitFunction(this.value);
    },
  },
  props: {
    classes: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "Fecha",
    },
    rules: {
      type: Array,
      required: false,
    },
    value: String,
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "date",
    },
    error: {
      type: Boolean,
    },
    errorStatus: {
      type: Boolean,
    },
    errorMessage: {
      type: String,
    },
    exams: {
      type: Boolean,
    },
  },
};
</script>

<style scoped>
</style>
