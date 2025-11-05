<main>
     <span style="margin: 0;">stai.</span>
     <div id="description">
          <p style="font-family: Saygon;">catch a show or movie you want to watch? just screenshot it. stai instantly adds it to your watchlist and quietly deletes the image. <br> <br> chat with your watchlist, get recommendations, and keep notes. <br> <br> stai is cross-platform, so your next binge is always at your fingertips.</p>
     </div>
     <button class="btn-striped-shadow" on:click={() => {window.location.href = '/register'}}>Get started</button>
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
          gap: 1rem;

          user-select: none;

          animation:stripes 120s linear infinite;
     }

     span{
          color: var(--primary);

          text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 35px;
          text-decoration: underline;
          text-align: center;
          font-size: 2rem;
     }

     p{
          color: var(--accent);
          font-size: 1rem;
     }

     #description{
          width: 80%;
          max-width: 45rem;

          padding: 2rem;
          padding-top: 0;
          padding-bottom: 0;

          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
     }

     .btn-striped-shadow {
          --btn-color: var(--primary);

          display: inline-block;
          position: relative;
          overflow: visible;

          transition:
               opacity 0.3s,
               z-index 0.3s step-end,
               transform 0.3s;

          background-color: var(--btn-color);
          color: var(--bg);

          box-shadow: 0px 0px 40px 0px rgba(241, 231, 53, 0.12);
          border-radius: 0.4rem;

          width: 10rem;
          height: 48px;
          margin: 0.5rem;
          z-index: 1;
          cursor: pointer;

     }

     .btn-striped-shadow:after,
     .btn-striped-shadow:before {
          content: "";
          display: block;
          position: absolute;
          z-index: 1;
          transition:
               transform 0.3s,
               max-height 0.3s,
               width 0.3s;
          background-image: linear-gradient(
               135deg,
               transparent 0,
               transparent 5px,
               var(--btn-color) 5px,
               var(--btn-color) 10px,
               transparent 10px
          );
          border-radius: 0.75rem;
     }

     .btn-striped-shadow:after {
          width: calc(100% - 4px);
          height: 8px;
          left: -10px;
          bottom: -9px;
          background-size: 15px 8px;
          background-repeat: repeat-x;
     }

     .btn-striped-shadow:before {
          width: 8px;
          max-height: calc(100% - 5px);
          height: 100%;
          left: -12px;
          bottom: -5px;
          background-size: 8px 15px;
          background-repeat: repeat-y;
          background-position: 0 100%;
     }

     .btn-striped-shadow:hover {
          transform: translate(-12px, 12px);
          z-index: 3;
     }

     .btn-striped-shadow:hover:before {
          max-height: calc(100% - 10px);
     }

     .btn-striped-shadow:hover:after,
     .btn-striped-shadow:hover:before {
          transform: translate(12px, -12px) scale(0.975);
     }

     @keyframes stripes {
          to {
               background-position : 100% 100%;
          }
     }

     @media (max-width: 600px) {
          p{
               font-size: 0.9rem;
          }

          .btn-striped-shadow {
               width: 7rem;
          }

          #description {
               padding: 1rem;
               padding-bottom: 0;
               padding-top: 0;
               width: 95%;
          }
     }
</style>