<template>
  <div class="mt-5">
    <v-row>
      <v-text-field
        :rules="rules"
        readonly
        prepend-icon="mdi-palette"
        :label="label"
        class="ml-5"
        :value="text"
      >
      </v-text-field>
    </v-row>
    <!--        <v-divider class="mt-2 mb-2"></v-divider>-->
    <v-color-picker
      v-bind:value="value"
      @input="emitFunction"
      hide-canvas
      hide-inputs
      show-swatches
      swatches-max-height="200"
      class="myClass mt-3"
    ></v-color-picker>
  </div>
</template>

<script>
export default {
  name: "ColorPicker",
  data() {
    return {
      text: "",
    };
  },
  created() {
    this.emitFunction(this.value);
  },
  props: {
    label: String,
    rules: {
      type: Array,
      required: false,
    },
    value: String,
  },
  methods: {
    emitFunction(event) {
      if (event) {
        this.text = event.hex ? event.hex : event;
        this.$emit("input", this.text);
      }
    },
  },
  // watch: {
  //     value(newValue) {
  //         console.log(newValue);
  //         this.text = this.value;
  //     }
  // }
};
</script>

<style scoped>
.myClass {
  max-width: 500px !important;
}
</style>