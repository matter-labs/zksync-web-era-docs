    <template>
        <footer class="footer">
            <span id="doc-version" style="display: none;">{{ docVersion }}</span>
            <div class="container">
                <div class="row">
                    
                    <div class="footer-col">
                        <h4>Learn</h4>
                        <ul>
                            <li><a href="https://zksync.io/ethos">Freedom</a></li>
                            <li><a href="https://zksync.io/hyperscalability">Hyperscalability</a></li>
                            <li><a href="https://zksync.io/security">Security</a></li>
                            <li><a href="https://zksync.io/ux">UX</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Era Network</h4>
                        <ul>
                            <li><a href="https://bridge.zksync.io/">Bridge</a></li>
                            <li><a href="https://ecosystem.zksync.io/">Ecosystem</a></li>
                            <li><a href="https://portal.zksync.io/">Wallet portal</a></li>
                            <li><a href="https://explorer.zksync.io/">Block explorer</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="https://join.zksync.dev/">Discord</a></li>
                            <li><a href="https://twitter.com/zksync">Twitter</a></li>
                            <li><a href="https://blog.matter-labs.io/">Blog</a></li>
                            <li><a href="https://t.me/zksync">Telegram</a></li>
                            <li><a href="https://github.com/matter-labs/">Github</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>General</h4>
                        <ul>
                            <li><a href="https://jobs.eu.lever.co/matterlabs">Career</a></li>
                            <li><a href="https://era.zksync.io/docs/contact.html">Contact us</a></li>
                            <!-- <li><a href="https://docs.zksync.io/legal/terms/">Terms of service</a></li>
                            <li><a href="https://docs.zksync.io/legal/privacy/">Privacy policy</a></li> -->
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    </template>    
    
    <script setup lang="ts">
    import { computed } from 'vue';
    import { usePageData } from '@vuepress/client';
    
    const pageData = usePageData();
    
    const getDocVersion = (branch = 'main', path = '') => {
        if (path.indexOf('dist/main') > -1 || path.indexOf('dist') === -1) {
        return branch;
        }
        const branchRex = /UserGuide\/V(\d+\.\d+\.x)/;
        if (branchRex.test(path)) {
        const tag = branchRex.exec(path)![1];
        return `rel/${tag.replace('.x', '')}`;
        }
        return branch;
    };
    
    const docVersion = computed(() => getDocVersion('main', pageData.value.path));
    </script>
