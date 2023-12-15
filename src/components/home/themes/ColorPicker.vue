<template>
  <div class="theme-color-picker">
    <div class="top">
      <h4>Pick a theme</h4>
    </div>
    <div class="content">
      <button
        @click="defaultColor" 
        :class="'-default' + (color == 'default' ? ' -active' : '')"
      ><div><div/></div>Default</button>
      <button 
        @click="goldColor" 
        :class="'-gold' + (color == 'gold' ? ' -active' : '')"
      ><div><div/></div>Gold</button>
      <button 
        @click="purpleColor" 
        :class="'-purple' + (color == 'purple' ? ' -active' : '')"
      ><div><div/></div>Purple</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ThemeColorPicker',

  props: [
    'color'
  ],

  methods: {
    defaultColor() {
      this.$emit('change', 'default');
    },

    goldColor() {
      this.$emit('change', 'gold');
    },

    purpleColor() {
      this.$emit('change', 'purple');
    }
  }
}
</script>

<style lang="scss" scoped>

.theme-color-picker {
  box-shadow: 0 20px 60px rgba(black, 0.1);
  background-color: var(--background);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  .top {
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 25px 25px 15px 25px;

    h4 {
      font-size: 18px;
      font-weight: 600;
      color: var(--foreground);
      text-align: center;
    }
  }

  .content {
    display: flex;
    gap: 10px;
    padding: 0 20px 25px 20px;

    button {
      flex-grow: 1;
      @include r('padding-top', 10, 15);
      @include r('padding-right', 20, 25);
      @include r('padding-bottom', 15, 20);
      @include r('padding-left', 20, 25);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      cursor: pointer;
      color: var(--foreground);
      transition: all 150ms $ease;
      font-weight: 500;
      color: var(--neutral-7);
      background-color: var(--neutral-2);

      > div {
        padding: 3px;
        border-radius: 100px;
        border: 2px solid transparent;
        transition: all 150ms $ease;  

        div {
          @include r('width', 40, 60);
          @include r('height', 40, 60);
          border-radius: 50px;
        }
      }

      &.-default > div div { background-color: #F7931A; }
      &.-gold > div div { background-color: #C7A974; }
      &.-purple > div div { background-color: #D42EE3; }

      &:hover {
        color: var(--foreground);
        
        > div {
          border-color: var(--primary);
        }
      }

      &.-active {
        color: var(--primary);

        > div {
          border-color: var(--primary);
        }
      }
    }
  }

  @include media-query(small) {
    flex-basis: 100%;
  }
}

</style>