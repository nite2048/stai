<main>
     <button on:click={() => {window.location.href = 'http://localhost:3000/auth/github'}} style="background-color: green; color: white;">Github login</button>
     <button on:click={() => {window.location.href = 'http://localhost:3000/auth/google'}} style="background-color: skyblue;">Google login</button>
</main>


<style>
     main{
          width: 100svw;
          height: 100svh;
          background-color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
     }

     button{
          display: inline-block;
          padding: 0.5rem 1rem;
          border: none;
          font-size: 14px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.12s ease;
     }
</style>
