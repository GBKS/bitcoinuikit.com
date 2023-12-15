<template>
  <button
    :class="classObject"
    :style="styleObject"
  >
    <div class="top">
      <div
        class="icon"
        :style="iconStyle"
        v-html="iconObject"
      />
      <div
        v-if="secondaryIcon"
        class="secondary-icon"
        :style="iconStyle"
        v-html="secondaryIconObject"
      />
    </div>
    <div class="bottom">
      <h3 class="-title-5">{{ label }}</h3>
      <p class="-body-6">{{ amount }}</p>
    </div>
  </button>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'WalletCard',

  props: [
    'label',
    'amount',
    'color',
    'icon',
    'secondaryIcon'
  ],

  data() {
    return {
      iconObject: Icons[this.icon],
      secondaryIconObject: Icons[this.secondaryIcon]
    }
  },

  computed: {
    classObject() {
      const c = ['wallet-card']

      return c.join(' ')
    },

    styleObject() {
      return {
        backgroundColor: 'var(--'+(this.color || 'neutral-4')+')'
      }
    },

    iconStyle() {
      return {
        color: 'var(--'+(this.color || 'background')+')'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.wallet-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  border-radius: 15px;
  padding: 15px;
  min-height: 150px;
  position: relative;
  box-shadow: 
    0 2px 2px rgba(0, 0, 0, 0.05),
    0 4px 4px rgba(0, 0, 0, 0.05),
    0 8px 8px rgba(0, 0, 0, 0.05),
    0 16px 16px rgba(0, 0, 0, 0.05),
    0 32px 32px rgba(0, 0, 0, 0.05);

  &:after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
    background: linear-gradient(135deg, black, white);
    mix-blend-mode: overlay;
    pointer-events: none;
    opacity: 0.2;
    transition: all 150ms $ease;
  }

  &:hover {
    cursor: pointer;

    &:after {
      opacity: 0.5;
    }
  }

  &:active {
    &:after {
      opacity: 0.7;
    }
  }
  
  .top {
    display: flex;
    gap: 5px;

    .icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      background-color: white;
      border-radius: 100px;

      ::v-deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    .secondary-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 20px;
      height: 20px;
      background-color: white;
      border-radius: 100px;

      ::v-deep(svg) {
        width: 10px;
        height: 10px;
      }
    }
  }

  .bottom {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    h3,
    p {
      color: white;
    }
  }
}

</style>
