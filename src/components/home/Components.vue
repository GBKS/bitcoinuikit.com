<template>
  <section class="home-components">
    <div class="header-copy">
      <h3>Components</h3>
      <p>The kit includes plenty of building blocks, from general UI components like buttons and inputs, to bitcoin-specific ones like balance display and address input.</p>
    </div>
    <div class="content-wrap">
      <div class="content">
        <div class="columns">
          <div class="column">
            <ComponentInfo
              title="Recovery phrase"
              description="For manual backup and verification of an onchain wallet mnemonic seed."
            >
              <Seed />
            </ComponentInfo>
            <ComponentInfo
              class="-transaction-item"
              title="Spending category"
              description="Based on transcations grouped by tag."
            >
              <CategoryItem
                title="Good life"
                description="35 transactions"
                amount="-270,261 sats"
                barPercentage="23"
                color="blue"
                icon="milk"
              />
              <CategoryItem
                title="Transportation"
                description="6 transactions"
                amount="-72,276 sats"
                barPercentage="57"
                color="green"
                icon="car"
              />
              <CategoryItem
                title="Home"
                description="12 transactions"
                amount="-43,857 sats"
                barPercentage="61"
                color="purple"
                icon="sofa"
              />
            </ComponentInfo>
          </div>
          <div class="column">
            <ComponentInfo
              class="-amount-input"
              title="Balance"
              description="Local-specific unit formatting for bitcoin, satoshi, and fiat currencies."
            >
              <Balance 
                amount="0.01076736"
                unit="bitcoin"
                locale="de"
                size="big"
              />
              <Balance 
                amount="520487"
                unit="satoshi"
                locale="de"
                size="medium"
              />
              <Balance 
                amount="51.87"
                unit="€"
                locale="de"
              />
            </ComponentInfo>
            <ComponentInfo
              class="-cards"
              title="Wallet"
              description="Visual cards representing different types of wallets."
            >
              <WalletCard
                label="Spending"
                amount="0.00 015 362 ₿"
                color="blue"
                icon="lightning"
              />
              <WalletCard
                label="Savings"
                amount="0.01 000 000 ₿"
                color="green"
                icon="shield"
                secondaryIcon="keys"
              />
              <WalletCard
                label="Icy stack"
                amount="412 ₿ "
                color="yellow"
                icon="bitcoin"
              />
              <WalletCard
                label="Inheritance"
                amount="0.01 000 000 ₿"
                color="orange"
                icon="account"
                secondaryIcon="visible"
              />
            </ComponentInfo>
            <ComponentInfo
              title="Fee graph"
              description="You should not be able to read this. It's a placeholder."
            />
          </div>
          <div class="column">
            <ComponentInfo
              class="-transaction-item"
              title="Transaction"
              description="Visualization of different states using the components above."
            >
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
            </ComponentInfo>
            <ComponentInfo
              class="-amount-input"
              title="Inline notification"
              description="Inform users about new information and important actions to take."
            >
              <InlineNotification 
                icon="shield"
                label="Back up your wallet in case you lose access." 
              />
              <InlineNotification 
                icon="lightning"
                color="purple"
                :priority="true"
                label="Back up your wallet in case you lose access."
              />
            </ComponentInfo>
            <ComponentInfo
              class="-tooltip"
              title="Transaction notification"
              description="Let users know when transactions succeed or fail."
            >
              <TransactionNotification
                label="Received 10,480 sats" 
              />
              <TransactionNotification
                :priority="true"
                color="blue"
                icon="infoCircle"
                label="Received 652 sats" 
              />
            </ComponentInfo>
          </div>
          <div class="column">
            <ComponentInfo
              class="-recipient"
              title="Recipient selection"
              description="Supports various input types across layers and a contact book."
            >
              <RecipientInput />
              <RecipientInput 
                avatarImage="four"
                text="Jacob Richardson"
              />
              <RecipientInput 
                text="jacob@bitcoin.design"
              />
              <RecipientInput 
                label="To address"
                text="14sv UvG3 ... w74S RQzi"
              />
            </ComponentInfo>
            <ComponentInfo
              class="-amount-input"
              title="Amount input"
              description="Lets users enter bitcoin or satoshi amounts and shows the balance."
            >
              <AmountInput 
                unit="₿" 
                balance="0.00520000" 
                formattedBalance="0,00 520 000" 
              />
              <AmountInput 
                unit="sats" 
                balance="520000" 
                formattedBalance="520.000" 
              />
            </ComponentInfo>
            <ComponentInfo
              title="Wallet type"
              description="Visual indicators of wallet network that users can personalize."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ComponentInfo from '@/components/kit/ComponentInfo.vue'
import WalletCard from '@/components/kit/WalletCard.vue'
import Seed from '@/components/kit/Seed.vue'
import TransactionItem from '@/components/kit/TransactionItem.vue'
import TransactionMeta from '@/components/kit/TransactionMeta.vue'
import AmountInput from '@/components/kit/AmountInput.vue'
import RecipientInput from '@/components/kit/RecipientInput.vue'
import CategoryItem from '@/components/kit/CategoryItem.vue'
import InlineNotification from '@/components/kit/InlineNotification.vue'
import TransactionNotification from '@/components/kit/TransactionNotification.vue'
import Balance from '@/components/kit/Balance.vue'

export default {
  name: 'HomeComponents',
  
  components: {
    ComponentInfo,
    Seed,
    WalletCard,
    TransactionItem,
    TransactionMeta,
    AmountInput,
    RecipientInput,
    CategoryItem,
    InlineNotification,
    TransactionNotification,
    Balance
  }
}
</script>

<style lang="scss" scoped>

.home-components {
  display: flex;
  flex-direction: column;
  align-items: center;

  > .content-wrap {
    height: 450px;
    width: 100vw;
    @include r('padding-top', 25, 50);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  
    > .content {
      display: flex;
      flex-direction: column;
      gap: 20px;
      width: 1675px;
      transform: scale(0.5);
      transform-origin: center top;

      ::v-deep(.component-info) {
        box-shadow: 0 20px 60px rgba(black, 0.1);

        &.-toggle,
        &.-icon-in-circle {
          > .content {
            display: flex;
            gap: 20px;
          }
        }

        &.-icons {
          > .content {
            display: flex;
            flex-wrap: wrap;
            // gap: 5px;

            > * {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 20%;
              aspect-ratio: 1;

              > * {
                width: 30px;
                height: 30px;
              }
            }
          }
        }

        &.-buttons {
          .-button-columns {
            display: flex;
            gap: 20px;
              flex-direction: column;

            .-button-column {
              display: flex;
              gap: 20px;
              align-items: flex-start;
            }
          }
        }

        &.-cards > .content {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;

          > * {
            flex-basis: 35%;
            flex-grow: 1;
          }
        }

        &.-transaction-item > .content {
          display: flex;
          flex-direction: column;
        }

        &.-amount-input > .content,
        &.-recipient > .content {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        &.-tooltip > .content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 25px;
        }
      }

      .columns {
        display: flex;
        gap: 20px;

        .column {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 18%;
          flex-grow: 1;
        }
      }
    }
  }

  @include media-query(medium) {

  }

  @include media-query(small) {
    > .content-wrap {
      height: 220px;

      > .content {
        transform: scale(0.25);
      }
    }
  }
}

</style>