<template>
  <div class="code-input">
    <input
      v-for="(item, index) in code"
      :key="index"
      class="-title-2"
      type="text"
      inputmode="numeric"
      maxlength="1"
      :value="item"
    />
  </div>
</template>

<script>
export default {
  name: 'CodeInput',

  props: [

  ],

  data() {
    return {
      code: '143  '
    }
  }
}
</script>

<style lang="scss" scoped>

.code-input {
  display: flex;
  gap: 10px;

  input {
    display: block;
    padding: 0;
    box-sizing: border-box;
    width: 36px;
    height: 44px;
    text-align: center;
    background-color: transparent;
    color: var(--foreground);
    border: 1px solid var(--neutral-7);
    border-radius: 3px;

    &:focus {
      outline: none;
      border-color: var(--primary);
    }

    &:active {
      border-color: var(--primary);
    }
  }
}

</style>
