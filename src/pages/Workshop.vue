<template>
  <div class="workshop-page">
    <div class="content">
      <a
        class="button"
        href="https://www.figma.com/community/file/916680391812923706"
        target="_blank"
        rel="noreferrer noopener"
      >Figma community file
        <img
          src="/assets/arrow-right.svg"
          width="24"
          height="24"
          alt="Arrow right"
        >
      </a>

      <br />

      <a
        class="button"
        href="https://www.figma.com/file/6aBjRUYQQlfai3PbIHPjPc/Advancing-Bitcoin-Workshop-file?node-id=4542%3A29518&t=jpnipTVDVMcTZPRZ-1"
        target="_blank"
        rel="noreferrer noopener"
      >Christoph's live file
        <img
          src="/assets/arrow-right.svg"
          width="24"
          height="24"
          alt="Arrow right"
        >
      </a>

      <br />
      <br />

      <ul>
        <li><a href="https://bitcoin.design/guide/resources/design-challenges/#challenge-6-private-purchase" target="_blank" rel="noreferrer notarget">Private purchase design challenge</a></li>
        <li><a href="https://chaincase.app/words/payjoin-design-flow" target="_blank" rel="noreferrer notarget">A Better PayJoin Design Flow</a></li>
        <li><a href="https://docs.google.com/document/d/1BN77GXs4VUOZISYK7QlyKvvFPqE7MzjOY1MHE_Qioeo/edit?usp=sharing" target="_blank" rel="noreferrer notarget">Work-in-progress case study draft</a></li>
        <li><a href="https://github.com/BitcoinDesign/Guide/issues/969#issuecomment-1447297652" target="_blank" rel="noreferrer notarget">Case study GitHub issue</a></li>
      </ul>

      <br />
      <br />
      <br />
      <br />

      <h3>Christoph</h3>

      <p class="perso"><a href="https://nosta.me/gbks@nosta.me?t=bubbles" target="_blank" rel="noreferrer notarget">Nostr</a> <a href="https://twitter.com/gbks" target="_blank" rel="noreferrer notarget">Twitter</a> <a href="http://gbks.substack.com" target="_blank" rel="noreferrer notarget">Blog</a></p>

      <br />
      <br />
      <br />
      <br />

      <h4>Public service announcement</h4>
      <h3>Let's make bitcoin more <a href="https://bitcoin.design/guide/designing-products/accessibility/" target="_blank" rel="noreferrer notarget">accessible</a></h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WorkshopPage',
  
  components: {

  },

  props: [
    'screenSize'
  ],

  beforeMount() {
    document.title = 'Advancing Bitcoin Workshop | Bitcoin UI Kit'
  }
}
</script>

<style lang="scss">

.workshop-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  @include r('gap', 25, 50);
  @include r('padding-top', 10, 20);
  @include r('padding-bottom', 100, 200);

  .content {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
    @include r('margin-top', 40, 80);
    padding-left: 10px;
    padding-right: 10px;
    text-align: center;

    h2 {
      margin: 0;
      font-weight: 300;
      @include r('font-size', 24, 48);
      @include r('letter-spacing', -0.5, -3);

      & + h3 {
        margin-top: 20px;
      }
    }

    h3 {
      margin: 0;
      font-weight: 300;
      @include r('font-size', 20, 30);
      @include r('letter-spacing', -0.5, -1);

      a {
        color: var(--foreground);
        transition: all 100ms $ease;

        &:hover {
          color: var(--primary);
        }
      }
      
      & + img {
        margin-top: 20px;
      }
    }

    a:not(.button, .video) {
      text-decoration: none;
      display: inline-block;
      position: relative;

      &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        bottom: 2px;
        width: 100%;
        height: 1px;
        transition: all 100ms $ease;
        background-color: rgba(var(--frontRGB), 0.15);
        pointer-events: none;
      }

      &:hover {
        &:before {
          background-color: var(--primary);
        }
      }
    }

    a.button,
    a.video {
      @include r('margin-top', 20, 20);
    }

    a.video {
      display: block;
      position: relative;
      line-height: 0;

      img {
        width: 100%;
        height: auto;
      }

      span {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 150ms linear;
        background-color: rgba(0, 0, 0, 0.1);

        svg {
          transition: all 150ms linear;
        }
      }

      &:hover {
        span {
          background-color: rgba(0, 0, 0, 0.25);

          svg {
            transform: scale(1.1, 1.1);
          }
        }
      }

      & + h2 {
        margin-top: 60px;
      }
    }

    p {
      margin: 20px 0 0 0;

      & + h2 {
        @include r('margin-top', 40, 60);
      }

      & + h3 {
        @include r('margin-top', 20, 30);
      }
    }

    p,
    ul li {
      @include r('font-size', 15, 21);
      color: rgba(var(--frontRGB), 0.55);
      line-height: 1.6;

      a {
        color: rgba(var(--frontRGB), 1);
        transition: all 100ms $ease;

        &:hover {
          color: $primary;
        }
      }
    }

    > img {
      width: 100%;
      height: auto;
    }

    p.perso {
      justify-content: center;
      display: flex;
      gap: 25px;
    }

    ul,
    ol {
      margin: 20px 0 0 0;
      padding: 0;
      list-style-type: none;

      li {
        margin: 0;
        padding: 0;
      }

      & + h2 {
        margin-top: 60px;
      }
    }
  }
}

</style>
