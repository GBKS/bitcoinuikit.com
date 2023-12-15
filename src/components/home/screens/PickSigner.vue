<template>
  <Screen>
    <TopBar
      buttonLeftIcon="caretLeft"
      buttonLeftLabel="Back"
    />
    <ScreenHeader
      title="Choose the device for signing this transaction"
    />
    <div class="list -gap-15">
      <DeviceItem
        title="Coldcard"
        description="Via SD card"
        icon="coldcard"
        :active="active == 'coldcard'"
        @click="select('coldcard')"
      />
      <DeviceItem
        title="Cobo Vault"
        description="Via QR code scan"
        icon="cobovault"
        :active="active == 'cobovault'"
        @click="select('cobovault')"
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
import DeviceItem from '@/components/kit/DeviceItem.vue'
import Button from '@/components/kit/Button.vue'

export default {
  name: 'PickSigner',
  
  components: {
    Screen,
    ScreenHeader,
    TopBar,
    DeviceItem,
    Button
  },

  data() {
    return {
      active: 'coldcard'
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