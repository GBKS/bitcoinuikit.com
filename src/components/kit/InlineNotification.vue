<template>
  <div :class="classObject" :style="styleObject">
    <div v-if="priority" class="icon" v-html="iconObject" />
    <IconInCircle v-if="!priority" :icon="icon" color="blue" size="big" />
    <p class="-body-5">{{ label }}</p>
    <div class="arrow" v-html="arrow" />
  </div>
</template>

<script>
import IconInCircle from '@/components/kit/IconInCircle.vue'
import Icons from '@/icons.js'

export default {
  name: 'CodeInput',

  components: {
    IconInCircle
  },

  props: [
    'icon',
    'label',
    'color',
    'priority'
  ],

  data() {
    return {
      iconObject: Icons[this.icon],
      arrow: this.priority ? Icons.arrowRight : Icons.caretRight
    }
  },

  computed: {
    classObject() {
      const c = [
        'inline-notification',
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

.inline-notification {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  cursor: pointer;

  &.-default {
    border: 1px solid var(--neutral-4);
    padding: 15px 10px 15px 15px;
    transition: all 100ms $ease;

    .icon-in-circle {
      flex-shrink: 0;
    }

    p {
      color: var(--foreground);
    }

    .arrow {
      color: var(--neutral-7);

      ::v-deep(svg) {
        width: 16px;
        height: 16px;
      }
    }

    &:hover {
      border-color: var(--primary);
    }
  }

  &.-priority {
    padding: 10px 15px;

    .icon {
      color: white;

      ::v-deep(svg) {
        width: 16px;
        height: 16px;
      }
    }

    p {
      color: white;
    }

    .arrow {
      color: white;

      ::v-deep(svg) {
        width: 16px;
        height: 16px;
      }
    }
  }

}

</style>
