<template>
  <Screen>
    <TopBar
      buttonLeftIcon="contact"
      buttonRightIcon="search"
    />
    <div class="top">
      <p class="balance-title -title-5" v-html="balanceContent" />
      <Balance
        amount="0.00512000"
        unit="bitcoin"
        locale="de"
        size="medium"
      />
      <Balance
        amount="12.80"
        unit="€"
        locale="de"
      />
    </div>
    <div class="list -dividers">
      <TransactionItem
        title="Luigi's pizza"
        description="4 min ago"
        amount="-21,736 sats"
        amountTwo="-12.75 €"
        avatarImage="one"
      />
      <TransactionItem
        title="Yum Yum Foods"
        description="Yesterday"
        amount="-128,021 sats"
        amountTwo="-75.00 €"
        avatarImage="two"
      />
      <TransactionItem
        title="Priya Lee"
        description="April 12, 2023"
        amount="+1,706,950 sats"
        amountTwo="1.000,00 €"
        avatarImage="three"
      />
      <TransactionMeta
        description="Web design work for ACME Inc. Invoice BDC01"
        :tags="['Business']"
      />
      <TransactionItem
        title="Winston Park"
        description="April 6, 2023"
        amount="+73,398 sats"
        amountTwo="-43.00 €"
        avatarImage="four"
      />
    </div>
    <NavTabs />
  </Screen>
</template>

<script>
import Screen from '@/components/kit/Screen.vue'
import TopBar from '@/components/kit/TopBar.vue'
import TransactionItem from '@/components/kit/TransactionItem.vue'
import TransactionMeta from '@/components/kit/TransactionMeta.vue'
import Balance from '@/components/kit/Balance.vue'
import NavTabs from '@/components/kit/NavTabs.vue'
import Icons from '@/icons.js'

export default {
  name: 'FeePicker',
  
  components: {
    Screen,
    TopBar,
    TransactionItem,
    TransactionMeta,
    Balance,
    NavTabs
  },

  data() {
    return {
      balanceContent: 'Your balance ' + Icons.linkCircle
    }
  }
}
</script>

<style lang="scss" scoped>

.top {
  padding-top: 25px;
  padding-bottom: 25px;

  .balance-title {
    text-align: center;
    color: var(--neutral-7);

    ::v-deep(svg) {
      width: 14px;
      height: 14px;
      vertical-align: middle;
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  align-content: stretch;
  flex-grow: 1;

  &.-dividers {
    * + * {
      border-top: 1px solid var(--neutral-5);
    }

    .transaction-item + .transaction-meta {
      border-top-width: 0;
    }
  }
}

</style>