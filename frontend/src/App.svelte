<script>
     import page from 'page';
     import { token } from './lib/stores.js';

     import Redirect from './routes/Redirect.svelte';
     import Upload from './routes/Upload.svelte';
     import Register from './routes/Register.svelte';
     import Dashboard from './routes/Dashboard.svelte';
     import Home from './routes/Home.svelte';

     let current;
     
     page('/', () => $token ? page('/dashboard') : current = Home);
     
     page('/register', () => $token ? page('/dashboard') : current = Register);
     page('/dashboard', () => current = Dashboard);
     page('/upload', () => current = Upload);

     page('/redirect', () => {
          current = Redirect;
          const urlParams = new URLSearchParams(window.location.search);

          $token = urlParams.get('token');
          page('/dashboard');
     });

     page.start();
</script>

<svelte:component this={current} />