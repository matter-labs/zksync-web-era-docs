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
        <!-- <NavLink
          class="secondary-button"
          :item="actionLink2"
        />-->
      </p>
      <p>
        <RouterLink
        to="/faq/"
        class="action-link">Frequently Asked Questions</RouterLink>
      </p>
    </header>

    <div v-if="data.features && data.features.length" class="features">
      <div v-for="(feature, index) in data.features" :key="index" class="feature">
        <img :src=feature.pic class="feature-illustration" />
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>

    <Content class="theme-default-content custom" />

    <div class="footer">

      <form
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

    actionLink2() {
      return {
        link: this.data.actionLink2,
        text: this.data.actionText2
      };
    }
  }
};
</script>

<style lang="stylus">
.go-to-top {
  cursor: pointer;
  position: fixed;
  bottom: 2rem;
  right: 1.5rem !important;
  width: 1.5rem !important;
  color: #fff !important;
  background-color: #797afb !important;
  border-radius: 10px !important;
  padding: 10px;
  z-index: 1;
}

.search-box {
  order: 1;
  margin-right: 0;
  margin-left: 1rem;
  position: fixed !important;
  right: 0;

  .suggestions {
    left: auto !important;
    right: 0 !important;
  }
}

.navbar {
  display: flex;
  justify-content: flex-start;

  .repo-link {
    display: none;
  }

  .links {
    left: 20rem;
    right: auto !important;
    padding-left: 0 !important;
  }

  .nav-item > a:not(.external).router-link-active, .nav-item > a:not(.external):hover {
    padding-bottom: 14px;
    border-bottom-width: 3px;
  }
}

.home {
  padding: $navbarHeight 2rem 0;
  max-width: $homePageWidth;
  margin: 0px auto;
  display: block;

  .hero {
    text-align: center;

    img {
      max-width: 100%;
      max-height: 140px;
      display: block;
      margin: 1rem auto 1.5rem;
    }

    h2 {
      font-size: 2rem;
      color: lighten($textColor, 20%);
    }

    h1, .description, action {
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
      color: #fff;
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

    .secondary-button {
      display: inline-block;
      width: 18rem;
      font-size: 1.2rem;
      color: #fff;
      background-color: $ml2;
      padding: 0.8rem 1.6rem;
      margin: 0.2rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border: 1px solid #eee;
      border-bottom: 1px solid darken($ml2, 15%);

      &:hover {
        background-color: lighten($ml2, 20%);
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
      display:block;
      margin:auto;
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
    padding: 1.5rem 2.5rem 0 2.5rem;
    border-top: 1px solid $borderColor;
    text-align: center;
    color: lighten($textColor, 25%);

    .input {
      display: inline-block;
      width: 18rem;
      font-size: 1rem;
      color: $ml2;
      background-color: #fff;
      padding: 0.5rem 1rem;
      margin: 0.1rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border: 1px solid #ddd;
    }

    .button {
      display: inline-block;
      width: 10rem;
      font-size: 1rem;
      color: $ml2;
      background-color: #fff;
      padding: 0.5rem 1.5rem;
      margin: 0.2rem;
      border-radius: 4px;
      transition: background-color 0.1s ease;
      box-sizing: border-box;
      border: 1px solid #ccc;
      cursor pointer;

      &:hover {
        background-color: darken(#fff, 5%);
      }
    }

  }
}

@media (max-width: $MQNarrow) {
  .navbar {
    .links {
      left: 16.4rem;

      .search-box {
        position: fixed;
        right: 0;
        z-index: 1;
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

  .navbar {
    .links {
      .search-box {
        margin-right: 1rem !important;
      }
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

      .secondary-button {
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
