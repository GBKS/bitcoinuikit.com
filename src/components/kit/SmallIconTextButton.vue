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
    'label',
    'disabled'
  ],

  computed: {
    classObject() {
      const c = [
        'kit-small-icon-text-button',
        '-body-5'
      ]

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

.kit-small-icon-text-button {
  transition: all 150ms $ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  color: var(--neutral-6);
  box-sizing: border-box;

  &:not(:disabled) {
    cursor: pointer;

    &:hover {
      color: var(--primary);
    }
  }

  ::v-deep(svg) {
    width: 18px;
    height: 18px;
  }
}

</style>
