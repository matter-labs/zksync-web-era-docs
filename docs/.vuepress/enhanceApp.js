export default ({ router }) => {
    router.beforeEach((to, from, next) => {
    const redirectList = {
        '/dev/zksync-v2/aa.html': 'dev/developer-guides/aa.html',
    }
    const redirect = redirectList[to.path]

    if (redirect) {
        next({ path: redirect })
    } else next()
    })
}