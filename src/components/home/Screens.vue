<template>
  <section class="home-screens">
    <div class="header-copy">
      <h3><a href="/screens">Screens</a></h3>
      <p>250+ screen mock-ups are included based on best practices in the <a href="https://bitcoin.design/guide/" target="_blank">Bitcoin Design Guide</a>. Home, settings, transactions, security center, and a lot&nbsp;more.</p>
    </div>
    <div class="content-wrap">
      <div class="content">
        <Cover />
        <Transaction />
        <Activity />
        <Receive />
        <CloudBackup />
        <BackupComplete />
      </div>
    </div>
  </section>
</template>

<script>
import Cover from '@/components/home/screens/Cover.vue'
import Transaction from '@/components/home/screens/Transaction.vue'
import Activity from '@/components/home/screens/Activity.vue'
import Receive from '@/components/home/screens/Receive.vue'
import CloudBackup from '@/components/home/screens/CloudBackup.vue'
import BackupComplete from '@/components/home/screens/BackupComplete.vue'

export default {
  name: 'HomeScreens',
  
  components: {
    Cover,
    Transaction,
    Activity,
    Receive,
    CloudBackup,
    BackupComplete
  }
}
</script>

<style lang="scss" scoped>

.home-screens {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .content-wrap {
    height: 500px;
    width: 100vw;
    @include r('margin-top', 25, 50);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;

    > .content {
      display: flex;
      gap: 50px;
      transform: scale(0.5);
      transform-origin: center top;

      .screen {
        box-shadow: 0 20px 60px rgba(black, 0.1);
        
        .content {
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
  }

  @include media-query(small) {
    > .content-wrap {
      height: 375px;

      > .content {
        transform: scale(0.25);
        flex-wrap: wrap;
        width: 1225px;

        .screen {
          flex-basis: 375px;
        }
      }
    }
  }
}

</style>