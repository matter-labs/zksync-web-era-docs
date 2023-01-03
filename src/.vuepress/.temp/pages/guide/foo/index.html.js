export const data = JSON.parse("{\"key\":\"v-5d5821d6\",\"path\":\"/guide/foo/\",\"title\":\"Foo feature\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Foo feature\",\"icon\":\"config\",\"description\":\"Introduction We support foo feature, ... Details ray (ray.md); ...;\",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/guide/foo/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"Docs Demo\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Foo feature\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Introduction We support foo feature, ... Details ray (ray.md); ...;\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"en-US\"}]]},\"headers\":[{\"level\":2,\"title\":\"Introduction\",\"slug\":\"introduction\",\"link\":\"#introduction\",\"children\":[]},{\"level\":2,\"title\":\"Details\",\"slug\":\"details\",\"link\":\"#details\",\"children\":[]}],\"readingTime\":{\"minutes\":0.05,\"words\":15},\"filePathRelative\":\"guide/foo/README.md\",\"autoDesc\":true}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
