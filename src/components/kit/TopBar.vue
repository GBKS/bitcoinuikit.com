<template>
  <div class="top-bar">
    <Button
      v-if="buttonLeftLabel || buttonLeftIcon"
      :label="buttonLeftLabel"
      :icon="buttonLeftIcon"
      iconPosition="left"
      theme="free"
    />
    <h2 v-if="title" class="-title-5">{{ title }}</h2>
    <Button
      v-if="buttonRightLabel || buttonRightIcon"
      :label="buttonRightLabel"
      :icon="buttonRightIcon"
      theme="free"
    />
  </div>
</template>

<script>
import Button from '@/components/kit/Button.vue'

export default {
  name: 'TopBar',
  
  components: {
    Button
  },

  props: [
    'title',
    'buttonLeftLabel',
    'buttonLeftIcon',
    'buttonRightLabel',
    'buttonRightIcon'
  ]
}
</script>

<style lang="scss" scoped>

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 46px;
  margin-left: calc(-1 * var(--screen-side-padding) + 5px);
  margin-right: calc(-1 * var(--screen-side-padding) + 5px);

  h2 {
    position: absolute;
    top: 50%;
    left: 50%;
    margin: 0;
    transform: translate(-50%, -50%);
    color: var(--foreground);
  }
}

</style>
