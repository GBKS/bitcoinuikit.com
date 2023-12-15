<template>
  <button
    :class="classObject"
    v-html="content"
    @click="click"
  />
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'NavTab',

  props: [
    'label',
    'icon',
    'active'
  ],

  computed: {
    content() {
      return Icons[this.icon] + '<p class="-body-7">' + this.label + '</p>'
    },

    classObject() {
      const c = [
        'nav-tab'
      ]

      if(this.active) c.push('-active')

      return c.join(' ')
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

.nav-tab {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75px;
  flex-basis: 30%;
  flex-grow: 1;
  gap: 8px;
  cursor: pointer;
  color: var(--neutral-7);

  ::v-deep(svg) {
    width: 20px;
    height: 20px;
  }

  &:hover,
  &.-active {
    color: var(--primary);
  }
}

</style>
