<template>
  <main class="home" aria-labelledby="main-title">
    <header class="hero">
      <h1>
        <img v-if="data.heroImage" :src="$withBase(data.heroImage)" :alt="zkSync" />
      </h1>

      <p class="subtitle">Scalability without compromises</p>
      <p
        class="description"
      >zkSync is a trustless, secure, user-centric protocol for scaling payments and smart contracts on Ethereum</p>

      <p class="action">
        <NavLink class="action-button" :item="actionLink" />
      </p>
      <p>
        <RouterLink
        to="/faq/"
        class="action-link">Frequently Asked Questions</RouterLink>
      </p>
    </header>

    <div v-if="data.features && data.features.length" class="features">
      <div v-for="(feature, index) in data.features" :key="index" class="feature">
        <img :src=feature.pic class="feature-illustration" alt="zkEVM" />
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>

    <Content class="theme-default-content custom" />

    <div class="footer">

      <form
        v-show="false"
        action="//dev.us4.list-manage.com/subscribe/post?u=ef8545da9c594ae082297352d&amp;id=fa715c9af0"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        novalidate
      >
        <div id="mc_embed_signup_scroll">
          <!-- <label for="mce-EMAIL">Follow zkSync news</label> -->
          <input
            aria-label="Search"
            type="email"
            value
            name="EMAIL"
            id="mce-EMAIL"
            placeholder="Your e-mail"
            class="input"
          />
          <input
            type="submit"
            value="Get updates"
            name="subscribe"
            id="mc-embedded-subscribe"
            class="button"
          />
          <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
          <div style="position: absolute; left: -5000px;" aria-hidden="true">
            <input type="text" name="b_ef8545da9c594ae082297352d_fa715c9af0" tabindex="-1" value />
          </div>
        </div>
      </form>
      <p>Made with ❤️ by <a href="https://matter-labs.io">Matter Labs</a></p>
    </div>
  </main>
</template>

<script>
import NavLink from "@theme/components/NavLink.vue";

export default {
  name: "Home",
  components: { NavLink },
  computed: {
    data() {
      return this.$page.frontmatter;
    },
    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      };
    },
  }
};
</script>

<style lang="stylus">
.theme-container {
  min-height: 100vh;
}
.home {
  padding: $navbarHeight 2rem 0;
  max-width: $homePageWidth;
  margin: 0 auto;
  display: flex;
  min-height: calc(100vh - 60px);
  justify-content: center;
  flex-flow: column;
  align-items: center;

  .hero {
    text-align: center;

    img {
      max-width: 100%;
      max-height: 100px;
      display: block;
      margin: 1rem auto;
    }

    h2 {
      font-size: 2rem;
      color: lighten($textColor, 20%);
    }

    h1, .description {
      margin: 1.8rem auto;
    }

    .subtitle {
      font-size: 2.2rem;
      line-height: 1.3;
      color: lighten($textColor, 5%);
    }

    .description {
      max-width: 35rem;
      font-size: 1.4rem;
      line-height: 1.3;
      color: lighten($textColor, 40%);
    }

    .action-link {
      display: inline-block;
      width: 18rem;
      font-size: 1.2rem;
      transition: background-color 0.1s ease;

      &:hover {
        color: lighten($ml1, 15%);
      }
    }

    .action-button {
      display: inline-block;
      width: 18rem;
      font-size: 1.2rem;
      color: #ffffff;
      background-color: $ml1;
      padding: 0.8rem 1.9rem;
      margin: 0.2rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border-bottom: 1px solid darken($ml1, 15%);

      &:hover {
        background-color: lighten($ml1, 15%);
      }
    }
  }

  .features {
    border-top: 1px solid $borderColor;
    padding: 2.5rem 0 2rem;
    margin-top: 2.5rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: stretch;
    justify-content: space-between;
  }

  .feature {
    flex-grow: 1;
    flex-basis: 30%;
    max-width: 30%;

    .feature-illustration {
      display: block;
      margin: auto;
    }

    h2 {
      font-size: 1.4rem;
      font-weight: 500;
      border-bottom: none;
      padding-bottom: 0;
      color: lighten($textColor, 10%);
      text-align: center;
    }

    p {
      text-align: center;
      color: lighten($textColor, 25%);
    }
  }

  .footer {
    border-top: 1px solid $borderColor;
    text-align: center;
    color: lighten($textColor, 25%);
    width: 100%;
    padding: 0 2.5rem;
    margin-top: auto;
    position: fixed;
    bottom: 0;

    .input {
      display: inline-block;
      width: 18rem;
      font-size: 1rem;
      color: $ml2;
      background-color: #ffffff;
      padding: 0.5rem 1rem;
      margin: 0.1rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border: 1px solid #dddddd;
    }

    .button {
      display: inline-block;
      width: 10rem;
      font-size: 1rem;
      color: $ml2;
      background-color: #ffffff;
      padding: 0.5rem 1.5rem;
      margin: 0.2rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border: 1px solid #cccccc;
      cursor: pointer;

      &:hover {
        background-color: darken(#ffffff, 5%);
      }
    }

  }
}

@media (max-width: $MQMobile) {
  .home {
    .features {
      flex-direction: column;
    }

    .feature {
      max-width: 100%;
      padding: 0 2.5rem;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .home {
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    .hero {
      img {
        max-height: 210px;
        margin: 2rem auto 1.2rem;
      }

      h1 {
        font-size: 2rem;
      }

      h1, .description, .action {
        margin: 1.2rem auto;
      }

      .description {
        font-size: 1.2rem;
      }

      .action-button {
        font-size: 1rem;
        padding: 0.6rem 1.2rem;
      }
    }

    .feature {
      h2 {
        font-size: 1.25rem;
      }
    }
  }
}
</style>
