<template>
  <button
    :class="classObject"
    :disabled="disabled"
    :aria-pressed="active"
    v-html="content"
    @click="select"
  />
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'KeypadKey',

  props: [
    'active',
    'label',
    'icon',
    'size',
    'disabled'
  ],

  computed: {
    classObject() {
      const c = ['keypad-key']

      if(this.active) c.push('-active')

      return c.join(' ')
    },

    content() {
      return this.icon ? Icons[this.icon] : this.label
    }
  },

  methods: {
    select() {
      this.$emit('select', this.label);
    }
  }
}
</script>

<style lang="scss" scoped>

.keypad-key {
  flex-basis: 33.33%;
  border-radius: 5px;
  appearance: none;
  border-width: 0px;
  background-color: transparent;
  font-size: 24px;
  height: 55px;
  transition: all 100ms $ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--foreground);

  ::v-deep(svg) {
    width: 18px;
    height: 18px;
    line-height: 1;
  }

  &:hover {
    background-color: var(--neutral-1);
    color: var(--primary);
  }

  &:active {
    background-color: var(--neutral-2);
  }
}

</style>
