<template>
  <Screen>
    <TopBar
      buttonLeftIcon="caretLeft"
      buttonLeftLabel="Back"
    />
    <ScreenHeader
      title="Adjust the fee"
    />
    <div class="list -gap-15">
      <FeeItem
        title="Fast"
        description="10-20 min"
        amount="₿ 0.00 003 000"
        amountTwo="€ 0.40"
        :active="active == 'fast'"
        @click="select('fast')"
      />
      <FeeItem
        title="Medium"
        description="20-60 min"
        amount="₿ 0.00 002 000"
        amountTwo="€ 0.30"
        :active="active == 'medium'"
        @click="select('medium')"
      />
      <FeeItem
        title="Slow"
        description="1-2 hours"
        amount="₿ 0.00 001 000"
        amountTwo="€ 0.20"
        :active="active == 'slow'"
        @click="select('slow')"
      />
    </div>
    <div class="bottom">
      <Button
        class=""
        label="Continue"
      />
    </div>
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import ScreenHeader from '@/components/kit/ScreenHeader.vue'
import FeeItem from '@/components/kit/FeeItem.vue'
import Button from '@/components/kit/Button.vue'

export default {
  name: 'FeePicker',
  
  components: {
    Screen,
    ScreenHeader,
    TopBar,
    FeeItem,
    Button
  },

  data() {
    return {
      active: 'fast'
    }
  },

  methods: {
    select(value) {
      this.active = value
    }
  }
}
</script>

<style lang="scss" scoped>

.list {
  margin-top: 25px;
}

</style>