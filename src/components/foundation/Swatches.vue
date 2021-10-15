<template>
  <div :class="className">
    <Swatch
      v-for="(item, index) in swatchesData"
      :key="'item_'+item.hex"
      :swatchData="item"
      :index="index"
      :screenSize="screenSize"
    />
  </div>
</template>

<script>
import Swatch from '@/components/foundation/Swatch.vue'

export default {
  name: 'Swatches',

  components: {
    Swatch
  },

  props: [
    'swatchesData',
    'screenSize'
  ],

  computed: {
    className() {
      const c = ['swatches']

      c.push('-'+this.screenSize)

      return c.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>

.swatches {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1000px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  @include r('gap', 20, 40);

  &.-small {
    
  }

  &.-medium {
    > div {
      flex-basis: 30%;
      flex-grow: 1;
    }
  }

  &.-large {
    > div {
      flex-basis: 30%;
      flex-grow: 1;
    }
  }
}

</style>
