<template>
  <div class="screen">
    <div class="top">
      <p>22:03</p>
      <div class="magic-island" />
      <div class="icons">
        <div v-html="iconOne" />
        <div v-html="iconTwo" />
        <div v-html="iconThree" />
      </div>
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="home-indicator" />
  </div>
</template>

<script>
import Icons from '@/icons.js'

export default {
  name: 'Screen',

  data() {
    return {
      iconOne: Icons.clock,
      iconTwo: Icons.marker,
      iconThree: Icons.video
    }
  }
}
</script>

<style lang="scss" scoped>

.screen {
  border-radius: 40px;
  background-color: var(--background);
  width: 375px;
  height: 812px;
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
  overflow: hidden;

  .top {
    display: flex;
    padding: 8px;
    align-items: center;
    opacity: 0.25;

    p {
      flex-grow: 1;
      text-align: center;
      opacity: 0.7;
    }

    .magic-island {
      width: 135px;
      height: 37px;
      border-radius: 100px;
      background-color: var(--foreground);
      opacity: 0.25;
    }

    .icons {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      opacity: 0.5;

      ::v-deep(svg) {
        width: 12px;
        height: 12px;
        color: var(--foreground);
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding-left: 20px;
    padding-right: 20px;
    
    &.-gap-25 {
      gap: 25px;
    }
  }

  ::v-deep(.list) {
    &.-gap-15 {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }

  ::v-deep(.bottom) {
    position: relative;
    padding-bottom: var(--screen-padding-bottom);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .home-indicator {
    width: 135px;
    height: 5px;
    border-radius: 100px;
    background-color: var(--foreground);
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0.25;
  }
}

</style>
