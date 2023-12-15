<template>
  <div class="swatch" :style="styleObject">
    <div class="color" :style="colorStyle" />
    <div class="copy">
        <h4>{{ swatchData.label }}</h4>
        <p>{{ swatchData.hex }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Swatch',

  props: [
    'swatchData',
    'screenSize',
    'index'
  ],

  computed: {
    styleObject() {
      let order = null
      let basis = null

      if(this.screenSize == 'large') {
        order = this.index%5 + this.index%5*3
      } else if(this.screenSize == 'small') {
        if(this.index < 5) {
          order += this.index*2 + 1
        } else {
          order = (this.index - 5)*2

          if(this.index > 10) {
            basis = '100%'
          }
        }
      }

      return {
        order,
        flexBasis: basis
      }
    },

    colorStyle() {
      return {
        backgroundColor: this.swatchData.hex
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.swatch {
  display: flex;
  align-items: center;
  @include r('gap', 10, 15);

  .color {
    @include r('width', 50, 100);
    @include r('height', 50, 100);
    border-radius: 5px;
    transition: all 100ms $ease;
  }

  .copy {
    padding-bottom: 5px;

    h4 {
      margin: 0;
      color: var(--foreground);
      @include r('font-size', 15, 21);
      font-weight: 400;
    }

    p {
      margin: 5px 0 0 0;
      color: var(--neutral-7);
      @include r('font-size', 13, 15);
    }
  }

  @include media-query(small) {
    flex-basis: 35%;
    flex-grow: 1;
  }
}

</style>
