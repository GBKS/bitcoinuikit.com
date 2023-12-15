<template>
  <div class="theme-type-picker">
    <div class="top">
      <h4>Typography</h4>
      <p>Scroll down to view changes</p>
    </div>
    <div class="content">
      <button
        @click="interType" 
        :class="'-inter' + (type == 'inter' ? ' -active' : '')"
      ><div><div>
        <h5>The quick brown jumps 
over the lazy dog.</h5>
        <p>The quick brown jumps 
over the lazy dog.</p>
      </div></div>Inter</button>
      <button 
        @click="titanOneType" 
        :class="'-titan-one' + (type == 'titan-one' ? ' -active' : '')"
      ><div><div>
        <h5>The quick brown jumps 
over the lazy dog.</h5>
        <p>The quick brown jumps 
over the lazy dog.</p>
      </div></div>Titan One & Nunito</button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ThemeTypePicker',

  props: [
    'type'
  ],

  methods: {
    interType() {
      this.$emit('change', 'inter');
    },

    titanOneType() {
      this.$emit('change', 'titan-one');
    }
  }
}
</script>

<style lang="scss" scoped>

.theme-type-picker {
  box-shadow: 0 20px 60px rgba(black, 0.1);
  background-color: var(--background);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;

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

    p {
      color: var(--neutral-7);
    }
  }

  .content {
    display: flex;
    gap: 5px;
    padding: 0 15px 25px 15px;

    button {
      border-radius: 12px;
      padding: 5px 5px 10px 5px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      cursor: pointer;
      color: var(--foreground);
      max-width: 300px;
      border: 1px solid transparent;
      transition: all 150ms $ease;
      background-color: var(--neutral-2);
      padding: 15px 15px 20px 15px;

      > div {
        padding: 3px;
        border-radius: 10px;
        border: 2px solid transparent;
        transition: all 150ms $ease; 

        div {
          border-radius: 5px;
          background-color: var(--foreground);
          color: var(--background);
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 10px;

          h5 {
            font-size: 15px;
            text-wrap: balance;
          }

          p {
            font-size: 13px;
            text-wrap: balance;
          }
        }
      }

      &.-inter {

      }

      &.-titan-one {
        div {
          h5 {
            font-family: "Titan One";
          }

          p {
            font-family: "Nunito Sans";
            font-weight: 500;
          }
        }
      }

      &:hover {
        color: var(--primary);
        
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
    > .content {
      flex-direction: column;
    }
  }
}

</style>