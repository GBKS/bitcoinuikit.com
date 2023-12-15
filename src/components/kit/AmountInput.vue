<template>
  <div :class="classObject" @click="click">
    <div class="top">
      <p class="-body-6">Amount</p>
      <p class="-body-6" @click="clickBalance">Balance: {{ formattedBalance || 0 }}</p>
    </div>
    <div class="bottom">
      <input
        class="-body-4"
        type="text"
        inputmode="numeric"
        maxlength="10"
        placeholder="0"
        ref="input"
        v-model="amountInput"
        @focus="focus"
        @blur="blur"
      />
      <p class="-body-4">{{ unit }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AmountInput',

  props: [
    'balance',
    'formattedBalance',
    'unit'
  ],

  data() {
    return {
      focused: false,
      amountInput: null
    }
  },

  computed: {
    classObject() {
      const c = [
        'amount-input'
      ]

      if(this.focused) c.push('-focus')

      return c.join(' ')
    }
  },

  methods: {
    focus() {
      this.focused = true
    },

    blur() {
      this.focused = false
    },

    click() {
      if(!this.focused) {
        this.$refs.input.focus()
      }
    },

    clickBalance() {
      this.amountInput = parseFloat(this.balance)
    }
  }
}
</script>

<style lang="scss" scoped>

.amount-input {
  padding: 10px 20px;
  border: 1px solid var(--neutral-4);
  border-radius: 5px;

  .top {
    display: flex;
    justify-content: space-between;
    gap: 5px;

    p {
      color: var(--foreground);
    }
  }

  .bottom {
    display: flex;
    justify-content: space-between;
    gap: 5px;

    input {
      display: block;
      flex-grow: 1;
      border-width: 0;
      background-color: transparent;
      padding: 0;
      color: var(--foreground);
      
      &::placeholder {
        color: var(--neutral-5);
      }

      &:focus {
        outline: none;
      }
    }

    p {
      color: var(--foreground);
    }
  }

  &.-focus {
    border-color: var(--primary);
  }

  &:hover {
    border-color: var(--primary);
  }
}

</style>
