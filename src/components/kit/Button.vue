<template>
  <button
    :class="classObject"
    :disabled="disabled"
    :aria-label="label"
    v-html="content"
    @click="click"
  />
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'Button',

  props: [
    'icon',
    'iconPosition', // left, right
    'label',
    'theme', // filled, outline, free
    'size', // small, medium, big
    'disabled'
  ],

  computed: {
    classObject() {
      const c = [
        'kit-button',
        '-' + (this.theme || 'filled'),
        '-' + (this.size || 'medium')
      ]

      if(this.icon) {
        c.push('-icon')

        if(!this.label) c.push('-icon-only')

        c.push('-' + (this.iconPosition || 'right'))
      }

      return c.join(' ')
    },

    content() {
      let result = ''

      if(this.icon && Icons[this.icon] && this.iconPosition == 'left') {
        result += Icons[this.icon]
      }

      if(this.label) {
        result += this.label
      }

      if(this.icon && Icons[this.icon] && this.iconPosition != 'left') {
        result += Icons[this.icon]
      }

      return result
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

.kit-button {
  appearance: none;
  border-width: 0;
  transition: all 150ms $ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: var(--corner-radius);
  color: white;
  box-sizing: border-box;

  &:not(:disabled) {
    cursor: pointer;
  }

  // Styles
  &.-filled {
    background-color: var(--primary);
  }

  &.-outline {
    background-color: transparent;
    border: 1px solid var(--neutral-5);
    color: var(--foreground);

    &:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
  }

  &.-free {
    background-color: transparent;

    &.-icon {
      color: var(--foreground);
    }

    &:hover {
      background-color: var(--neutral-2);
      color: var(--primary);
    }
  }

  // Sizes
  &.-small {
    height: 30px;
    font-size: 15px;

    &:not(.-icon-only) {
      padding-left: 15px;
      padding-right: 15px;
    }

    &.-icon {
      ::v-deep(svg) {
        width: 16px;
        height: 16px;
      }
    }

    &.-icon-only {
      width: 30px;
    }
  }

  &.-medium {
    height: 46px;
    font-size: 18px;

    &:not(.-icon-only) {
      padding-left: 20px;
      padding-right: 20px;
    }

    &.-icon {
      ::v-deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    &.-icon-only {
      width: 46px;
    }
  }

  &.-big {
    height: 60px;
    font-size: 21px;

    &:not(.-icon-only) {
      padding-left: 20px;
      padding-right: 20px;
    }

    &.-icon {
      ::v-deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    &.-icon-only {
      width: 60px;
    }
  }
}

</style>
