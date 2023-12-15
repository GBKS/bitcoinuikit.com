<template>
  <Screen class="receive-screen">
    <TopBar
      buttonLeftIcon="caretLeft"
      buttonLeftLabel="Back"
      buttonRightIcon="ellipsis"
    />
    <ScreenHeader
      title="Share payment request"
    />
    <div class="middle">
      <div v-html="qr" />
      <p class="-body-4">250,000 sats<br/>2 Hawaii pizzas</p>
    </div>
    <div class="buttons">
      <Button 
        label="Share" 
        icon="share" 
        iconPosition="left" 
        theme="outline"
      />
      <div>
        <Tooltip 
          v-if="copied" 
          label="Copied" 
          color="green"
          icon="check"
        />
        <Button 
          label="Copy" 
          icon="copy" 
          iconPosition="left" 
          theme="outline"
          @click="copy"
        />
      </div>
      <Button icon="nfc" theme="outline" />
    </div>
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import Button from '@/components/kit/Button.vue'
import ScreenHeader from '@/components/kit/ScreenHeader.vue'
import Tooltip from '@/components/kit/Tooltip.vue'
import Icons from '@/icons.js'

export default {
  name: 'Receive',
  
  components: {
    Screen,
    TopBar,
    Button,
    ScreenHeader,
    Tooltip
  },

  data() {
    return {
      copied: false,
      qr: Icons.bigQr
    }
  },

  methods: {
    copy() {
      this.copied = true
      const ref = this
      setTimeout(() => { ref.copied = false }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>

.receive-screen {
  padding-bottom: var(--screen-padding-bottom);

  .middle {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    gap: 20px;
    color: var(--foreground);

    > div {
      ::v-deep(svg) {
        width: 250px;
        aspect-ratio: 1;
      }
    }

    p {
      text-align: center;
    }
  }

  .buttons {
    margin-top: 30px;
    display: flex;
    gap: 10px;

    button,
    > div {
      &:nth-child(1),
      &:nth-child(2) {
        flex-grow: 1;
      }
    }

    > div {
      position: relative;

      .tooltip {
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translate(-50%, -15px);
      }
    }
  }
}

</style>