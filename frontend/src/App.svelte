<script>
     import page from 'page';
     import { token } from './stores.js';

     import Default from './Default.svelte';
     import Redirect from './Redirect.svelte';
     import Success from './Success.svelte';

     let current = Default;

     page('/', () => current = Default);
     page('/success', () => current = Success);
     
     page('/redirect', () => {
          current = Redirect;
          const urlParams = new URLSearchParams(window.location.search);

          $token = urlParams.get('token');
          page('/success');
     });

     page.start();
</script>

<main>
  <svelte:component this={current} />
</main>
