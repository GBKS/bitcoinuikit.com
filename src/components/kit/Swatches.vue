<template>
  <div class="swatches">
    <Swatch
      v-for="(item, index) in colors"
      :key="index"
      :name="item.name"
      :variable="item.variable"
    />
  </div>
</template>

<script>
import Swatch from '@/components/kit/Swatch.vue'

export default {
  name: 'Swatches',
  
  components: {
    Swatch
  },

  data() {
    return {
      colors: [
        {
          name: 'Primary',
          variable: 'primary'
        },
        {
          name: 'Pink',
          variable: 'pink'
        },
        {
          name: 'Red',
          variable: 'red'
        },
        {
          name: 'Orange',
          variable: 'orange'
        },
        {
          name: 'Yellow',
          variable: 'yellow'
        },
        {
          name: 'Green',
          variable: 'green'
        },
        {
          name: 'Mint',
          variable: 'mint'
        },
        {
          name: 'Teal',
          variable: 'teal'
        },
        {
          name: 'Cyan',
          variable: 'cyan'
        },
        {
          name: 'Blue',
          variable: 'blue'
        },
        {
          name: 'Indigo',
          variable: 'indigo'
        },
        {
          name: 'Purple',
          variable: 'purple'
        },
        {
          name: 'Brown',
          variable: 'brown'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

.swatches {
  display: flex;
  gap: 10px;
}

</style>
