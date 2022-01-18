export default async function (to, from, savedPosition) {
  if (to.path !== from.path) {
    this.app.$store.commit("scroll/setLastPath", from.path);
    this.app.$store.commit("scroll/setLastScroll", savedPosition);
  }

  if (savedPosition) {
    return savedPosition;
  }

  const findEl = (hash, x) => {
    return (
      document.querySelector(hash) ||
      new Promise((resolve) => {
        if (x > 100) {
          return resolve();
        }
        setTimeout(() => {
          resolve(findEl(hash, ++x || 1));
        }, 200);
      })
    );
  };

  if (to.hash) {
    const el = await findEl(to.hash);
    const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 84; /* 84px - size of the header */
    if ("scrollBehavior" in document.documentElement.style) {
      return window.scrollTo({ top: offsetTop, behavior: "smooth" });
    } else {
      return window.scrollTo(0, offsetTop);
    }
  }

  return { x: 0, y: 0 };
}
