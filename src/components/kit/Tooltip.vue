<template>
  <div
    :class="classObject"
    :style="styleObject"
  >
    {{ label }}
    <div v-if="icon" class="icon" v-html="iconObject" />
    <div class="arrow" :style="styleObject" />
</div>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'Tooltip',

  props: [
    'icon',
    'label',
    'color'
  ],

  data() {
    return {
      iconObject: Icons[this.icon]
    }
  },

  computed: {
    classObject() {
      const c = [
        'tooltip',
        '-body-5'
      ]

      if(this.icon && Icons[this.icon]) {
        c.push('-icon')
      }

      return c.join(' ')
    },

    content() {
      let result = ''

      if(this.icon && Icons[this.icon]) {
        result += Icons[this.icon]
      }

      if(this.label) {
        result += this.label
      }

      return result
    },

    styleObject() {
      return {
        backgroundColor: 'var(--'+(this.color || 'blue')+')'
      }
    }
  },

  methods: {
    click() {
      this.$emit('click');
    }
  }
}
</script>

<style lang="scss" scoped>

.tooltip {
  transition: all 150ms $ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  box-sizing: border-box;
  position: relative;
  border-radius: 5px;
  padding: 10px 15px;

  &.-icon {
    .icon {
      ::v-deep(svg) {
        width: 14px;
        height: 14px;
      }
    }
  }

  .arrow {
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 14px;
    height: 14px;
    border-bottom-right-radius: 3px;
    transform: translate(-50%, 50%) rotate(45deg);
  }
}

</style>
