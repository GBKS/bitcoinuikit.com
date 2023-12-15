<template>
  <div :class="classObject">
    <div class="top">
      <IconInCircle
        v-if="icon"
        :icon="icon"
        :color="iconColor"
        size="huge"
      />
      <h1 v-if="title" class="-title-4">{{ title }}</h1>
      <p v-if="description" class="-body-5">{{ description }}</p>
    </div>
    <Button
      v-if="buttonLabel || buttonIcon"
      :label="buttonLabel"
      :icon="buttonIcon"
      @click="buttonClick"
    />
  </div>
</template>

<script>
import Button from '@/components/kit/Button.vue'
import IconInCircle from '@/components/kit/IconInCircle.vue'

export default {
  name: 'ScreenHeader',
  
  components: {
    IconInCircle,
    Button
  },

  props: [
    'alignLeft',
    'icon',
    'iconColor',
    'title',
    'description',
    'buttonLabel',
    'buttonIcon',
    'stretch'
  ],

  computed: {
    classObject() {
      const c = ['screen-header']

      if(this.alignLeft) c.push('-align-left')
      if(this.stretch) c.push('-stretch')

      return c.join(' ')
    }
  },

  methods: {
    buttonClick() {
      this.$emit('buttonClick');
    }
  }
}
</script>

<style lang="scss" scoped>

.screen-header {
  display: flex;
  flex-direction: column;

  .top {
    padding-top: 25px;
    display: flex;
    flex-direction: column;

    h1 {
      color: var(--foreground);
      text-wrap: balance;
    }

    p {
      color: var(--neutral-7);
      text-wrap: balance;
    }
  }

  .icon-in-circle + h1 { margin-top: 20px; }
  h1 + p { margin-top: 10px; }
  .top + .button { margin-top: 25px; }

  &.-stretch {
    flex-grow: 1;
    padding-bottom: var(--screen-padding-bottom);

    .top {
      flex-grow: 1;
    }
  }

  .button {
    width: 100%;
  }

  &.-align-left {
    
  }

  &:not(.-align-left) {
    .top {
      align-items: center;

      h1,
      p {
        margin-left: 0;
        margin-right: 0;
        margin-bottom: 0;

        text-align: center;
      }
    }
  }
}

</style>
