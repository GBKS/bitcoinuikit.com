<template>
  <div class="bar">
    <div
      class="bar-shape"
      :style="shapeStyleObject"
    />
    <p
      v-if="showLabel"
      class="-title-7"
      :style="styleObject"
    >{{ label }}</p>
  </div>
</template>

<script>
export default {
  name: 'bar',

  props: [
    'percentage',
    'showLabel',
    'color'
  ],

  computed: {
    shapeStyleObject() {
      return {
        width: this.percentage + '%',
        backgroundColor: 'var(--'+(this.color || 'green')+')'
      }
    },

    styleObject() {
      return {
        color: 'var(--'+(this.color || 'green')+')'
      }
    },

    label() {
      return this.percentage + '%'
    }
  }
}
</script>

<style lang="scss" scoped>

.bar {
  display: flex;
  align-items: center;
  gap: 5px;

  .bar-shape {
    height: 6px;
    border-radius: 100px;
  }
}

</style>
