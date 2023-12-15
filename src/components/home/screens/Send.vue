<template>
  <Screen class="send-screen">
    <TopBar
      buttonLeftIcon="contact"
    />
    <div class="balance-wrap">
      <Balance
        :amount="balanceAmount"
        unit="satoshi"
        :notation="notation"
        locale="de"
        size="big"
      />
      <Balance
        :amount="euroAmount"
        :notation="euroNotation"
        unit="€"
        locale="de"
      />
    </div>
    <Keypad
      :disableFractions="true"
      @input="input"
    />
    <div class="buttons">
      <Button label="Send" />
      <Button icon="qr" />
      <Button label="Receive" />
    </div>
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import Balance from '@/components/kit/Balance.vue'
import Keypad from '@/components/kit/Keypad.vue'
import Button from '@/components/kit/Button.vue'

export default {
  name: 'Send',
  
  components: {
    Screen,
    TopBar,
    Balance,
    Keypad,
    Button
  },

  data() {
    return {
      amount: "0",
      userBalance: 512000
    }
  },

  computed: {
    balanceAmount() {
      return parseInt(this.amount)
    },

    euroAmount() {
      return parseInt(this.amount) / 40000
    },

    notation() {
      return this.amount.length < 10 ? 'standard' : 'compact'
    },

    euroNotation() {
      return 'standard'
    }
  },

  methods: {
    input(value) {
      if(value == '<') {
        if(this.amount.length > 1) {
          this.amount = this.amount.substr(0, this.amount.length-1)
        } else {
          this.amount = '0'
        }
      } else {
        if(this.amount === '0') {
          this.amount = value+''
        } else {
          this.amount += value+''
        }

        if(parseInt(this.amount) > this.userBalance) {
          this.amount = this.userBalance+''
        }
      }
      
      console.log('input', this.amount)
    }
  }
}
</script>

<style lang="scss" scoped>

.send-screen {
  padding-bottom: var(--screen-padding-bottom);

  .balance-wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  .buttons {
    margin-top: 30px;
    display: flex;
    gap: 10px;

    button {
      &:nth-child(1),
      &:nth-child(3) {
        flex-grow: 1;
      }
    }
  }
}

</style>