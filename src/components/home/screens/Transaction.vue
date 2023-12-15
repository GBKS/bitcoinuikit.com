<template>
  <Screen>
    <TopBar
      buttonLeftIcon="caretLeft"
      buttonLeftLabel="Back"
    />
    <div class="top">
      <p class="-body-6">You received</p>
      <h1 class="-title-3">+5,651,816 sats</h1>
    </div>
    <div class="options">
      <SmallIconTextButton label="Contact" icon="contact" />
      <SmallIconTextButton label="Note" icon="pencil" />
      <SmallIconTextButton label="Tag" icon="tag" />
    </div>
    <div class="list">
      <div>
        <p class="-body-5">From address</p>
        <p class="-body-5">3LaQ ... NfkY</p>
      </div>
      <div>
        <p class="-body-5">Fee</p>
        <p class="-body-5">+2,987 sats</p>
      </div>
      <div>
        <p class="-body-5">When</p>
        <p class="-body-5">Aug 12, 2021 at 4:35pm</p>
      </div>
      <button>
        <p class="-body-5">Details</p>
        <div v-html="icon" />
      </button>
    </div>
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import SmallIconTextButton from '@/components/kit/SmallIconTextButton.vue'
import Icons from '@/icons.js'

export default {
  name: 'Transaction',
  
  components: {
    Screen,
    TopBar,
    SmallIconTextButton
  },

  data() {
    return {
      icon: Icons.caretDown
    }
  }
}
</script>

<style lang="scss" scoped>

.top {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  h1 {
    color: var(--green);
  }

  p {
    color: var(--foreground);
  }
}

.options {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;

  > div,
  > button {
    display: flex;
    gap: 5px;
    justify-content: space-between;
    padding-top: 15px;
    padding-bottom: 15px;

    p {
      color: var(--foreground);
    }

    ::v-deep(svg) {
      width: 15px;
      height: 15px;
      color: var(--foreground);
    }

    & + div,
    & + button {
      border-top: 1px solid var(--neutral-4);
    }
  }

  > button {
    cursor: pointer;
    
    &:hover {
      p,
      ::v-deep(svg) {
        color: var(--primary);
      }
    }
  }
}

</style>