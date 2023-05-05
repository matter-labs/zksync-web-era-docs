    <template>
        <footer class="footer">
            <span id="doc-version" style="display: none;">{{ docVersion }}</span>
            <div class="container">
                <div class="row">
                    <div class="footer-col">
                        <h4>Matterlabs</h4>
                        <ul>
                            <li><a href="https://portal.zksync.io/bridge">Bridge</a></li>
                            <li><a href="https://explorer.zksync.io/">Explorer</a></li>
                            <li><a href="https://ecosystem.zksync.io/">Ecosystem</a></li>
                            <li><a href="https://jobs.eu.lever.co/matterlabs">Career</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Community</h4>
                        <ul>
                            <li><a href="https://join.zksync.dev/">Discord</a></li>
                            <li><a href="https://t.me/zksync_support">Telegram</a></li>
                            <li><a href="#">Stack Overflow</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Socials</h4>
                        <ul>
                            <li><a href="https://twitter.com/zksync">Twitter</a></li>
                            <li><a href="https://www.youtube.com/@zkSync-era">Youtube</a></li>
                            <li><a href="https://www.linkedin.com/company/matterlabs">LinkedIn</a></li>
                        </ul>
                    </div>
                    <div class="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Privacy</a></li>
                            <li><a href="#">Terms</a></li>
                            <li><a href="#">Cookie Policy</a></li>
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
