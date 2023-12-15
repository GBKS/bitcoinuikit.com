<template>
  <section class="home-themes">
    <div class="header-copy">
      <h3>Themes</h3>
      <p>The kit comes with a flexible theming system that quickly allows you to pick from several color palettes and type styles and then customize them to your needs (via the <a href="https://www.figma.com/community/plugin/1254869452790045259/bitcoin-ui-kit" target="_blank">UI Kit plugin</a>). Try some of the options below to preview.</p>
    </div>
    <div class="content-wrap">
      <div class="content">
        <ModePicker @change="setMode" :mode="mode" />
        <ColorPicker @change="setColor" :color="color" />
        <TypePicker @change="setType" :type="type" />
      </div>
    </div>
  </section>
</template>

<script>
import ColorPicker from '@/components/home/themes/ColorPicker.vue'
import ModePicker from '@/components/home/themes/ModePicker.vue'
import TypePicker from '@/components/home/themes/TypePicker.vue'

export default {
  name: 'HomeScreens',
  
  components: {
    ColorPicker,
    ModePicker,
    TypePicker
  },

  props: [
    'color',
    'mode',
    'type'
  ],

  methods: {
    setColor(value) {
      this.$emit('setColor', value)
    },

    setMode(value) {
      this.$emit('setMode', value)
    },

    setType(value) {
      this.$emit('setType', value)
    },

    updateType() {
      if(this.currentType) {
        document.body.classList.remove(this.currentType)
        this.currentType = null
      }

      this.currentType = '--type-'+this.type
      document.body.classList.add(this.currentType)
    }
  }
}
</script>

<style lang="scss" scoped>

.home-themes {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .content-wrap {
    @include r('margin-top', 25, 50);
    display: flex;
    flex-direction: column;
    align-items: center;

    > .content {
      display: flex;
      gap: 20px;
      padding: 0 15px;
      transform-origin: center top;
      max-width: 750px;
    }
  }

  @include media-query(medium-up) {
    > .content-wrap {
      > .content {
        flex-wrap: wrap;

        > div {
          flex-basis: 36%;
          flex-grow: 1;
          
          &:last-child {
            flex-basis: 100%;
          }
        }
      }
    }
  }

  @include media-query(small) {
    > .content-wrap {
      > .content {
        flex-direction: column;
      }
    }
  }
}

</style>