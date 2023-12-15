<template>
  <Screen>
    <div class="header">
      <div v-html="icon" />
      <h1 class="-title-1">Bitcoin wallet</h1>
      <p class="-body-3">A simple bitcoin wallet for your enjoyment.</p>
    </div>
    <div class="bottom">
      <Button label="Create a new wallet" />
      <Button label="Restore existing wallet" theme="free" />
      <p class="-body-6">Your wallet, your coins<br/>100% open-source & open-design</p>
    </div>
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import Button from '@/components/kit/Button.vue'
import Icons from '@/icons.js'

export default {
  name: 'Cover',
  
  components: {
    Screen,
    Button
  },

  data() {
    return {
      icon: Icons.bitcoin
    }
  }
}
</script>

<style lang="scss" scoped>

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  flex-grow: 1;

  > div {
    color: var(--primary);
    line-height: 1;
    padding: 0;
    position: relative;

    &:before {
      display: block;
      position: absolute;
      top: 5px;
      left: 5px;
      right: 5px;
      bottom: 5px;
      content: '';
      background-color: white;
      border-radius: 100px;
    }

    ::v-deep(svg) {
      position: relative;
      width: 100px;
      height: 100px;
    }
  }

  h1 {
    margin-top: 30px;
    color: var(--foreground);
  }

  p {
    text-align: center;
    color: var(--neutral-7);
  }
}

.bottom {
  flex-grow: 0;

  button {
    &:nth-child(2) {
      color: var(--primary);
    }
  }

  button + button {
    margin-top: 10px;
  }

  p {
    margin-top: 10px;
    text-align: center;
    color: var(--neutral-7);
  }
}

</style>