<template>
  <button :class="classObject">
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
export default {
  name: 'FeeItem',

  props: [
    'title',
    'description',
    'amount',
    'amountTwo',
    'active'
  ],

  computed: {
    classObject() {
      const c = ['fee-item']

      if(this.active) c.push('-active')

      return c.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>

.fee-item {
  display: flex;
  gap: 10px;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid var(--neutral-4);
  border-radius: 10px;
  appearance: none;
  background-color: transparent;
  text-align: left;
  cursor: pointer;

  .left,
  .right {
    display: flex;
    flex-direction: column;
    gap: 0;
    // flex-grow: 1;

    p {
      margin: 0;
      color: var(--foreground);

      &:nth-child(2) {
        color: var(--neutral-7);
      }
    }
  }

  .left {
    p {
      // text-align: left;
    }
  }

  .right {
    align-items: flex-end;

    p {
      // text-align: right;
    }
  }

  &:hover,
  &.-active {
    border-color: var(--primary);
  }
}

</style>
