<template>
  <button :class="classObject">
    <Avatar :image="avatarImage" />
    <div class="left">
      <p class="-body-5">{{ title }}</p>
      <p class="-body-6" v-if="description">{{ description }}</p>
    </div>
    <div class="right" v-if="amount || amountTwo">
      <p class="-body-5" v-if="amount">{{ amount }}</p>
      <p class="-body-6" v-if="amountTwo">{{ amountTwo }}</p>
    </div>
  </button>
</template>

<script>
import Avatar from '@/components/kit/Avatar.vue'

export default {
  name: 'TransactionItem',
  
  components: {
    Avatar
  },

  props: [
    'title',
    'description',
    'amount',
    'amountTwo',
    'avatarImage',
    'active'
  ],

  computed: {
    classObject() {
      const c = ['transaction-item']

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

.transaction-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 0;
  text-align: left;
  cursor: pointer;

  .left,
  .right {
    display: flex;
    flex-direction: column;
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
  }

  .right {
    align-items: flex-end;
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
