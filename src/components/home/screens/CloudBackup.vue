<template>
  <Screen>
    <TopBar
      buttonLeftIcon="caretLeft"
      title="Settings"
      buttonRightLabel="Done"
    />
    <ScreenHeader
      icon="cloud"
      iconColor="purple"
      title="Convenient backups with cloud storage"
      description="Your recovery phrase will be encrypted and backed up to your cloud provider, only you will be able to access it."
      buttonLabel="Next"
      :stretch="true"
    />
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import ScreenHeader from '@/components/kit/ScreenHeader.vue'

export default {
  name: 'CloudBackup',
  
  components: {
    Screen,
    ScreenHeader,
    TopBar
  }
}
</script>

<style lang="scss" scoped>

.screen-header {
  margin-top: 50px;
}

</style>