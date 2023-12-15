<template>
  <button :class="classObject">
    <IconInCircle :icon="icon" :color="color" size="big" />
    <div class="left">
      <p class="-body-5">{{ title }}</p>
      <p class="-body-6" v-if="description">{{ description }}</p>
      <Bar :percentage="barPercentage" :color="color" :showLabel="true" />
    </div>
    <div class="right">
      <p class="-body-5">{{ amount }}</p>
      <div v-html="caretRight" />
    </div>
  </button>
</template>

<script>
import IconInCircle from '@/components/kit/IconInCircle.vue'
import Bar from '@/components/kit/Bar.vue'
import Icons from '@/icons.js'

export default {
  name: 'TransactionItem',
  
  components: {
    IconInCircle,
    Bar
  },

  props: [
    'title',
    'description',
    'amount',
    'barPercentage',
    'color',
    'icon',
    'active'
  ],

  data() {
    return {
      caretRight: Icons.caretRight
    }
  },

  computed: {
    classObject() {
      const c = ['category-item']

      if(this.active) c.push('-active')

      if(parseFloat(this.amount) > 0) {
        c.push('-positive')
      }

      return c.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>

.category-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 0;
  text-align: left;
  cursor: pointer;

  .left,
  .right {
    display: flex;
    gap: 0;

    p {
      margin: 0;
      color: var(--foreground);
      transition: all 100ms $ease;

      &:nth-child(2) {
        color: var(--neutral-7);
      }
    }
  }

  .left {
    flex-grow: 1;
    flex-direction: column;

    .bar {
      margin-top: 5px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    align-items: flex-end;
    gap: 5px;

    > div {
      color: var(--neutral-7);

      ::v-deep(svg) {
        width: 16px;
        height: 16px;
      }
    }
  }

  &.-positive {
    .right {
      p {
        &:first-child {
          color: var(--green);
        }
      }
    }
  }

  &:hover {
    .left {
      p {
        &:first-child {
          color: var(--primary);
        }
      }
    }
  }
}

</style>
