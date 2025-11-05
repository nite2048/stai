<script>
     import { token } from "../lib/stores";
     console.log($token)
</script>

<main>
     {#if $token}
          <span >You are logged in.</span>
          <span on:click={() => {window.location.href = '/upload'}} >upload</span>
          <span on:click={() => {token.reset()}} >logout</span>
     {:else}
          <span on:click={() => {window.location.href = '/register'}}>Register</span>
     {/if}
</main>

<style>
     main {
          width: 100svw;
          height: 100svh;

          background: repeating-linear-gradient(135deg, transparent 0 5px, var(--pattern) 5px 10px);
          background-size: 200% 200%;
          background-position: 0% 0%;

          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;

          user-select: none;

          animation:stripes 120s linear infinite;
     }
     
     span{
          text-align: center;
          font-size: 1rem;
          font-weight: bold;
          color: var(--primary);
          font-family: 'Saygon', sans-serif;
     }
     
     @keyframes stripes {
          to {
               background-position : 100% 100%;
          }
     }


</style>
