    <template>
        <div>
        <slot :latestVersion="latestVersion" />
        </div>
    </template>
    
    <script>
    import axios from 'axios';
    
    export default {
        data() {
        return {
            latestVersion: null,
        };
        },
        mounted() {
        axios
            .get('https://raw.githubusercontent.com/matter-labs/zksolc-bin/main/version.json')
            .then((response) => {
            this.latestVersion = response.data.latest;
            })
            .catch((error) => {
            console.error('Error fetching latest version:', error);
            });
        },
    };
    </script>
    