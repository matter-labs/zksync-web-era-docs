export const data = JSON.parse("{\"key\":\"v-00fb7173\",\"path\":\"/zh/guide/foo/ray.html\",\"title\":\"Ray\",\"lang\":\"en-US\",\"frontmatter\":{\"title\":\"Ray\",\"icon\":\"config\",\"description\":\"功能详情...\",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://v2-docs.zksync.io/zh/guide/foo/ray.html\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Ray\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"功能详情...\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"en-US\"}]]},\"headers\":[],\"readingTime\":{\"minutes\":0.03,\"words\":9},\"filePathRelative\":\"zh/guide/foo/ray.md\",\"autoDesc\":true}")

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
