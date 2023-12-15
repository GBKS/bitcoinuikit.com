<template>
  <section class="home-flows">
    <div class="header-copy">
      <h3><a href="/screens">User flows</a></h3>
      <p>Onboarding, wallet creation, sending, receiving and other common user flows are laid out with explanations and can be easily customized.</p>
    </div>
    <div class="content-wrap">
      <div class="content">
        <Send />
        <div class="icon" v-html="arrowRight" />
        <FeePicker />
        <div class="icon" v-html="arrowRight" />
        <PickSigner />
        <div class="icon" v-html="arrowRight" />
        <HowSigningWorks />
      </div>
    </div>
  </section>
</template>

<script>
import Send from '@/components/home/screens/Send.vue'
import PickSigner from '@/components/home/screens/PickSigner.vue'
import FeePicker from '@/components/home/screens/FeePicker.vue'
import HowSigningWorks from '@/components/home/screens/HowSigningWorks.vue'
import Icons from '@/icons.js'

export default {
  name: 'HomeFlows',
  
  components: {
    Send,
    PickSigner,
    FeePicker,
    HowSigningWorks
  },

  data() {
    return {
      arrowRight: Icons.arrowRight
    }
  }
}
</script>

<style lang="scss" scoped>

.home-flows {
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
      gap: 20px;
      align-items: center;
      transform: scale(0.5);
      transform-origin: center top;

      .screen {
        box-shadow: 0 20px 60px rgba(black, 0.1);
        
        .content {
          padding-left: 20px;
          padding-right: 20px;
        }
      }

      .icon {
        ::v-deep(svg) {
          width: 30px;
          height: 30px;
          color: var(--foreground);
        }
      }
    }
  }

  @include media-query(small) {
    > .content-wrap {
      height: 325px;

      > .content {
        transform: scale(0.35);
      }
    }
  }
}

</style>