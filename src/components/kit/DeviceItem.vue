<template>
  <button :class="classObject">
    <div
      class="icon"
      v-html="iconObject"
    />
    <div class="left">
      <p class="-body-5">{{ title }}</p>
      <p class="-body-6" v-if="description">{{ description }}</p>
    </div>
    <div
      class="right"
      v-html="caretRight"
    />
  </button>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'FeeItem',

  props: [
    'title',
    'description',
    'icon',
    'active'
  ],

  data() {
    return {
      iconObject: Icons[this.icon],
      caretRight: Icons.caretRight
    }
  },

  computed: {
    classObject() {
      const c = ['device-item']

      if(this.active) c.push('-active')

      return c.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>

.device-item {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--neutral-4);
  border-radius: 10px;
  appearance: none;
  background-color: transparent;
  text-align: left;
  cursor: pointer;

  .icon {
    color: var(--foreground);
    
    ::v-deep(svg) {
      width: 45px;
      height: 65px;
    }
  }

  .left {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 0;

    p {
      margin: 0;
      color: var(--foreground);

      &:nth-child(2) {
        color: var(--neutral-7);
      }
    }
  }

  .right {
    ::v-deep(svg) {
      width: 15px;
      height: 15px;
      color: var(--neutral-7);
    }
  }

  &:hover,
  &.-active {
    border-color: var(--primary);
  }
}

</style>
