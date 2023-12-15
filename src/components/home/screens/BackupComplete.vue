<template>
  <Screen>
    <ScreenHeader
      icon="check"
      iconColor="white"
      title="Your wallet is backed up"
      description="If you lose this device, you can recover your encrypted wallet backup from iCloud."
      buttonLabel="Next"
      :stretch="true"
    />
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import ScreenHeader from '@/components/kit/ScreenHeader.vue'

export default {
  name: 'BackupComplete',
  
  components: {
    Screen,
    ScreenHeader
  }
}
</script>

<style lang="scss" scoped>

.screen {
  background-color: var(--green);

  ::v-deep(> .content) {
    .screen-header {
      margin-top: 50px;
      
      .icon-in-circle { 
        background-color: white !important;
        
        svg {
          color: var(--green);
        }
      }

      h1, p { color: white; }

      button {
        background-color: white;
        color: var(--green);
      }
    }
  }
}

</style>