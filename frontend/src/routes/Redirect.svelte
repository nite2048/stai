<main>
     <p style="color: white;">You are being redirected.</p>
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
     
     @keyframes stripes {
          to {
               background-position : 100% 100%;
          }
     }
</style>