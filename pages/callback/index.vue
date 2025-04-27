<script setup>
    import { onMounted } from 'vue';

    onMounted(() => {
        const params = new URLSearchParams(window.location.search);

        if (window.opener) {
            window.opener.postMessage({
                source: 'spotify-auth',
                code: params.get('code'),
                state: params.get('state')
            }, window.location.origin);
            
            window.close();
        }
    });
</script>