    import axios from 'axios';

    export default ({ Vue }) => {
    // Fetch the latest version using Axios
    axios
        .get('https://raw.githubusercontent.com/matter-labs/zksolc-bin/main/version.json')
        .then((response) => {
        const latestVersion = response.data.latest;

        // Add the latest version to Vue's prototype
        Vue.prototype.$latestVersion = latestVersion;
        })
        .catch((error) => {
        console.error('Error fetching latest version:', error);
        });
    };
