<template>
  <div class="included-content">
    <IncludedContentItem
      v-for="(item, index) in content"
      :key="index"
      :content="item"
      :screenSize="screenSize"
    />
  </div>
</template>

<script>
import IncludedContentItem from '@/components/IncludedContentItem.vue'

export default {
  name: 'IncludedContent',
  
  components: {
    IncludedContentItem
  },

  props: {
    screenSize: String
  },

  data() {
    return {
      content: [
        {
          title: 'Elements',
          description: 'Colors, icons, text styles and other details make up the smallest parts the UI kit. Customize them and the changes are automatically applied to all the other components.',
          image: {
            url: '/assets/elements.png',
            retina: '/assets/elements@2x.png',
            mobile: '/assets/elements-mobile.png',
            mobileRetina: '/assets/elements-mobile@2x.png',
            width: 1275,
            height: 809,
            alt: 'Stuff'
          }
        },
        {
          title: 'Components',
          description: 'The kit includes plenty of building blocks, from general UI components like buttons and inputs, to Bitcoin-specific ones like balance display and address input.',
          image: {
            url: '/assets/components.png',
            retina: '/assets/components@2x.png',
            mobile: '/assets/components-mobile.png',
            mobileRetina: '/assets/components-mobile@2x.png',
            width: 1317,
            height: 897,
            alt: 'Stuff'
          }
        },
        {
          title: 'Screens',
          description: 'Common UI screens are included for both mobile and desktop applications. Home, settings, transactions, security center, and a lot more.',
          image: {
            url: '/assets/screens.png',
            retina: '/assets/screens@2x.png',
            mobile: '/assets/screens-mobile.png',
            mobileRetina: '/assets/screens-mobile@2x.png',
            width: 1426,
            height: 654,
            alt: 'Stuff'
          }
        },
        {
          title: 'User flows',
          description: 'Onboarding, wallet creation, sending, receiving and other common user flows are laid out with explanations and can be easily customized.',
          image: {
            url: '/assets/user-flow.png',
            retina: '/assets/user-flow@2x.png',
            mobile: '/assets/user-flow-mobile.png',
            mobileRetina: '/assets/user-flow-mobile@2x.png',
            width: 1056,
            height: 498,
            alt: 'Stuff'
          }
        }
      ]
    }
  },

  computed: {

  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>

@import "@/scss/variables.scss";
@import "@/scss/mixins.scss";

.included-content {
  display: flex;
  flex-wrap: wrap;

  @include media-query(medium-down) {
    margin-top: 30px;
  }

  @include media-query(large) {
    max-width: 1440px;
    margin-left: auto;
    margin-right: auto;
  }
}

</style>
