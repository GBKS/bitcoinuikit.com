<template>
  <div
    :class="classObject"
    :aria-label="label"
    :style="styleObject"
  >
    <div 
      v-if="theme == 'light'" 
      class="circle" 
      :style="circleStyle"
    />
    <div 
      class="icon" 
      v-html="content"
      :style="iconStyle"
    />
  </div>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'Toggle',

  props: [
    'icon',
    'color',
    'size', // small, medium, big, huge, massive
    'label',
    'theme' // default, light, grey
  ],

  computed: {
    classObject() {
      const c = [
        'icon-in-circle',
        '-' + (this.size || 'medium'),
        '-' + (this.theme || 'default')
      ]

      return c.join(' ')
    },

    content() {
      return Icons[this.icon]
    },

    styleObject() {
      const result = {}

      if(!this.theme || this.theme == 'default') {
        result.backgroundColor = 'var(--'+(this.color || 'green')+')'
      }

      return result
    },

    circleStyle() {
      return {
        backgroundColor: 'var(--'+(this.color || 'green')+')'
      }
    },

    iconStyle() {
      const result = {}

      if(this.theme != 'default') {
        result.color = 'var(--'+(this.color || 'green')+')'
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>

.icon-in-circle {
  transition: all 150ms $ease;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  line-height: 0;

  &.-default {
    .icon {
      ::v-deep(svg) {
        color: white;
      }
    }
  }

  &.-light {
    position: relative;

    .circle {
      display: block;
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      border-radius: 100px;
      opacity: 0.2;
    }

    .icon {
      position: relative;
    }
  }

  &.-grey {
    background-color: var(--neutral-2);
  }

  // Sizes
  &.-small {
    width: 20px;
    height: 20px;

    ::v-deep(svg) {
      width: 10px;
      height: 10px;
    }
  }

  &.-medium {
    width: 30px;
    height: 30px;

    ::v-deep(svg) {
      width: 15px;
      height: 15px;
    }
  }

  &.-big {
    width: 40px;
    height: 40px;

    ::v-deep(svg) {
      width: 20px;
      height: 20px;
    }
  }

  &.-huge {
    width: 60px;
    height: 60px;

    ::v-deep(svg) {
      width: 30px;
      height: 30px;
    }
  }

  &.-massive {
    width: 80px;
    height: 80px;

    ::v-deep(svg) {
      width: 40px;
      height: 40px;
    }
  }
}

</style>
