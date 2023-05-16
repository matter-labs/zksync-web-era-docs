    <template>
        <footer class="footer">
            <span id="doc-version" style="display: none;">{{ docVersion }}</span>
            <div class="container">
                <div class="row">
                    
                    <div class="footer-col">
                        <h4>Ethos & values</h4>
                        <ul>
                            <li><a target="_blank" href="https://zksync.io/ethos">Freedom</a></li>
                            <li><a target="_blank" href="https://zksync.io/hyperscalability">Hyperscalability</a></li>
                            <li><a target="_blank" href="https://zksync.io/security">Security</a></li>
                            <li><a target="_blank" href="https://zksync.io/ux">UX</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Era Network</h4>
                        <ul>
                            <li><a target="_blank" href="https://bridge.zksync.io/">Bridge</a></li>
                            <li><a target="_blank" href="https://ecosystem.zksync.io/">Ecosystem</a></li>
                            <li><a target="_blank" href="https://portal.zksync.io/">Wallet portal</a></li>
                            <li><a target="_blank" href="https://explorer.zksync.io/">Block explorer</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Community</h4>
                        <ul>
                            <li><a target="_blank" href="https://github.com/matter-labs/">GitHub</a></li>
                            <li><a target="_blank" href="https://join.zksync.dev/">Discord</a></li>
                            <li><a target="_blank" href="https://twitter.com/zksync">Twitter: zkSync Era</a></li>
                            <li><a target="_blank" href="mailto:support@zksync.io">Support</a></li>
                            <li><a target="_blank" href="https://t.me/zksync">Telegram</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a target="_blank" href="https://blog.matter-labs.io/">Blog</a></li>
                            <li><a target="_blank" href="https://jobs.eu.lever.co/matterlabs">Careers</a></li>
                            <li><a target="_blank" href="https://twitter.com/the_matter_labs">Twitter: Matter Labs</a></li>
                            <li><a target="_blank" href="mailto:events@matterlabs.dev">Press</a></li>
                            <li><a target="_blank" href="mailto:media@matterlabs.dev">Events</a></li>
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
