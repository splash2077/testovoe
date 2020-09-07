<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <v-checkbox label="r" v-model="r" @change="$emit('rwx', getDecimal())">r</v-checkbox>
      </v-col>
      <v-col cols="4">
        <v-checkbox label="w" v-model="w" @change="$emit('rwx', getDecimal())">w</v-checkbox>
      </v-col>
      <v-col cols="4">
        <v-checkbox label="x" v-model="x" @change="$emit('rwx', getDecimal())">x</v-checkbox>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  props: {
    chmod: Number,
  },
  data: () => ({
    r: false,
    w: false,
    x: false,
  }),
  watch: {
    chmod: {
      immediate: true,
      handler(val) {
        this.r = Boolean(val & 4);
        this.w = Boolean(val & 2);
        this.x = Boolean(val & 1);
      },
    },
  },
  methods: {
    getBinary(number) {
      return number.toString(2);
    },

    getDecimal() {
      let temp = "" + Number(this.r) + Number(this.w) + Number(this.x);
      return parseInt(temp, 2);
    },
  },
};
</script>