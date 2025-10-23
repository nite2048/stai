<script>
     import page from 'page';
     import { token } from './lib/stores.js';

     import Redirect from './routes/Redirect.svelte';
     import Success from './routes/Success.svelte';
     import Upload from './routes/Upload.svelte';
     let current = Upload;

     page('/', () => current = Upload);
     page('/success', () => current = Success);

     page('/redirect', () => {
          current = Redirect;
          const urlParams = new URLSearchParams(window.location.search);

          $token = urlParams.get('token');
          page('/success');
     });

     page.start();
</script>

<svelte:component this={current} />