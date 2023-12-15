<template>
  <Screen>
    <TopBar
      buttonLeftIcon="caretLeft"
      buttonLeftLabel="Back"
    />
    <ScreenHeader
      title="How this works"
      description="There are three steps to finalize this transaction before you can send it."
    />
    <ol>
      <li class="-body-5">Copy the unsigned transaction to your device.</li>
      <li class="-body-5">Sign the transaction on your device.</li>
      <li class="-body-5">Copy the signed transaction back to this phone.</li>
    </ol>
    <div class="bottom">
      <Button label="Start" />
    </div>
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import ScreenHeader from '@/components/kit/ScreenHeader.vue'
import Button from '@/components/kit/Button.vue'

export default {
  name: 'HowSigningWorks',
  
  components: {
    Screen,
    ScreenHeader,
    TopBar,
    Button
  }
}
</script>

<style lang="scss" scoped>

ol {
  margin: 0;
  padding: 0;
  counter-reset: index;
  list-style-type: none;

  li {
    position: relative;
    color: var(--neutral-7);
    padding: 20px 0;
    counter-increment: index;
    display: flex;
    align-items: center;
    gap: 10px;

    &:before {
      display: block;
      content: ''counter(index);
      width: 28px;
      line-height: 28px;
      flex-shrink: 0;
      background-color: var(--neutral-4);
      border-radius: 100px;
      text-align: center;
    }

    & + li {
      border-top: 1px solid var(--neutral-4);
    }
  }
}

</style>