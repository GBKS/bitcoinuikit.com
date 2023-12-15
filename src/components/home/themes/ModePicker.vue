<template>
  <div class="theme-mode-picker">
    <div class="top">
      <h4>Light or dark?</h4>
    </div>
    <div class="content">
      <button
        @click="lightMode" 
        :class="'-light' + (mode == 'light' ? ' -active' : '')"
      ><div><div/></div>Light</button>
      <button 
        @click="darkMode" 
        :class="'-dark' + (mode == 'dark' ? ' -active' : '')"
      ><div><div/></div>Dark</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ThemeModePicker',

  props: [
    'mode'
  ],

  methods: {
    lightMode() {
      this.$emit('change', 'light');
    },

    darkMode() {
      this.$emit('change', 'dark');
    }
  }
}
</script>

<style lang="scss" scoped>

.theme-mode-picker {
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
      transition: all 150ms $ease;
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

      &.-dark {
        > div div {
          border: 1px solid var(--neutral-4);
          background-color: black;
        }
      }

      &.-light {
        > div div {
          border: 1px solid var(--neutral-4);
          background-color: white;
        }
      }

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
}

</style>