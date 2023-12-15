<template>
  <div :class="classObject" :style="styleObject">
    <div class="icon" v-html="iconObject" />
    <p class="-body-5">{{ label }}</p>
  </div>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'CodeInput',

  props: [
    'icon',
    'label',
    'color',
    'priority'
  ],

  data() {
    return {
      iconObject: Icons[this.icon || 'receive']
    }
  },

  computed: {
    classObject() {
      const c = [
        'transaction-notification',
        '-'+(this.priority ? 'priority' : 'default')
      ]

      return c.join(' ')
    },

    styleObject() {
      let result = {}

      if(this.priority) {
        result.backgroundColor = 'var(--'+this.color+')'
      }

      return result
    }
  }
}
</script>

<style lang="scss" scoped>

.transaction-notification {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 100px;
  cursor: pointer;
  padding: 8px 20px;

  .icon {
    ::v-deep(svg) {
      width: 18px;
      height: 18px;
    }
  }

  &.-default {
    background-color: var(--neutral-2);
    transition: all 100ms $ease;
    color: var(--foreground);

    &:hover {
      color: var(--primary);
    }
  }

  &.-priority {
    color: white;
    flex-direction: row-reverse;

    p {
      padding-right: 10px;
      border-right: 1px solid white;
    }
  }

}

</style>
