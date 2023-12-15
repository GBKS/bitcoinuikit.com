<template>
  <div class="swatch">
    <div 
      class="color"
      :style="styleObject"
    />
    <p class="-body-5">{{ name }}</p>
  </div>
</template>

<script>

export default {
  name: 'Swatch',

  props: [
    'name',
    'variable'
  ],

  computed: {
    styleObject() {
      return {
        backgroundColor: 'var(--'+this.variable+')'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.swatch {
  flex-basis: 10%;
  flex-grow: 1;
  color: var(--foreground);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .color {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--corner-radius);
  }
}

</style>
