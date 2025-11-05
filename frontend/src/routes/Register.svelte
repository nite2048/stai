<script>
	import { token } from '../lib/stores';
	import { onMount } from 'svelte';

	onMount(() => {
		if ($token) {
			window.location.href = '/dashboard';
		}
	});
</script>

{#if !$token}
	<main>
		<div id="artifacts">
               <div class="shape-zigzag">
                    <svg class="float-wave" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 25 L25 0 L50 25 L75 0 L100 25 L125 0 L150 25 L175 0 L200 25"
                              fill="none" stroke="var(--accent-color)" stroke-width="4"/>
                    </svg>
               </div>

               <div class="shape-zigzag-two">
                    <svg class="float-wave" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 25 L25 0 L50 25 L75 0 L100 25 L125 0 L150 25 L175 0 L200 25"
                              fill="none" stroke="var(--accent-color)" stroke-width="4"/>
                    </svg>
               </div>

               <div class="shape-zigzag-three">
                    <svg class="float-wave" viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 25 L25 0 L50 25 L75 0 L100 25 L125 0 L150 25 L175 0 L200 25"
                              fill="none" stroke="var(--accent-color)" stroke-width="4"/>
                    </svg>
               </div>

               <div class="shape-cross">
                    <svg class="float-wave" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="10" x2="40" y2="40" stroke="var(--accent-color)" stroke-width="4"/>
                    <line x1="40" y1="10" x2="10" y2="40" stroke="var(--accent-color)" stroke-width="4"/>
                    </svg>
               </div>

               <div class="shape-plus">
                    <svg class="float-wave" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <line x1="25" y1="10" x2="25" y2="40" stroke="var(--accent-color)" stroke-width="4"/>
                    <line x1="10" y1="25" x2="40" y2="25" stroke="var(--accent-color)" stroke-width="4"/>
                    </svg>
               </div>

               <div class="shape-diamond">
                    <svg class="float-wave" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="25,5 45,25 25,45 5,25"
                              fill="none" stroke="var(--accent-color)" stroke-width="4"/>
                    </svg>
               </div>

               <div class="shape-dots">
                    <svg class="float-wave" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                         <g fill="var(--accent-color)">
                              <circle cx="10" cy="10" r="2"/><circle cx="30" cy="10" r="2"/><circle cx="50" cy="10" r="2"/>
                              <circle cx="70" cy="10" r="2"/><circle cx="90" cy="10" r="2"/>
                              <circle cx="10" cy="30" r="2"/><circle cx="30" cy="30" r="2"/><circle cx="50" cy="30" r="2"/>
                              <circle cx="70" cy="30" r="2"/><circle cx="90" cy="30" r="2"/>
                         </g>
                    </svg>
               </div>

               <div class="shape-triangle">
                    <svg class="float-wave" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                         <polygon points="30,5 55,55 5,55" fill="none" stroke="var(--primary)" stroke-width="3"/>
                    </svg>
               </div>

               <div class="shape-triangle-two">
                    <svg class="float-wave" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                         <polygon points="30,5 55,55 5,55" fill="none" stroke="var(--primary)" stroke-width="3"/>
                    </svg>
               </div>

               <div class="shape-hexagon">
                    <svg class="float-wave" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="var(--primary)" stroke-width="3"/>
                    </svg>
               </div>

               <div class="shape-dottedcircle">
                    <svg class="float-wave" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                         <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" stroke-width="4" stroke-dasharray="2 10"/>
                    </svg>
               </div>

               <div class="shape-rectangle">
                    <svg class="float-wave" viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="50" height="90" fill="none" stroke="var(--accent-color)" stroke-width="4" stroke-linejoin="miter" stroke-linecap="butt"/>
                    </svg>
               </div>

               <div class="shape-orbit">
                    <svg class="float-wave" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" stroke-width="3"/>
                    <circle cx="80" cy="30" r="6" fill="var(--primary)"/>
                    </svg>
               </div>

               <div class="shape-dotgrid">
                    <svg class="float-wave" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g fill="var(--primary)">
                         <circle cx="10" cy="10" r="2"/><circle cx="30" cy="10" r="2"/><circle cx="50" cy="10" r="2"/>
                         <circle cx="70" cy="10" r="2"/><circle cx="90" cy="10" r="2"/>
                         <circle cx="10" cy="30" r="2"/><circle cx="30" cy="30" r="2"/><circle cx="50" cy="30" r="2"/>
                         <circle cx="70" cy="30" r="2"/><circle cx="90" cy="30" r="2"/>
                         <circle cx="10" cy="50" r="2"/><circle cx="30" cy="50" r="2"/><circle cx="50" cy="50" r="2"/>
                         <circle cx="70" cy="50" r="2"/><circle cx="90" cy="50" r="2"/>
                    </g>
                    </svg>
               </div>

               <div class="shape-dotgrid-two">
                    <svg class="float-wave" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <g fill="var(--primary)">
                         <circle cx="10" cy="10" r="2"/><circle cx="30" cy="10" r="2"/><circle cx="50" cy="10" r="2"/>
                         <circle cx="70" cy="10" r="2"/><circle cx="90" cy="10" r="2"/>
                         <circle cx="10" cy="30" r="2"/><circle cx="30" cy="30" r="2"/><circle cx="50" cy="30" r="2"/>
                         <circle cx="70" cy="30" r="2"/><circle cx="90" cy="30" r="2"/>
                         <circle cx="10" cy="50" r="2"/><circle cx="30" cy="50" r="2"/><circle cx="50" cy="50" r="2"/>
                         <circle cx="70" cy="50" r="2"/><circle cx="90" cy="50" r="2"/>
                    </g>
                    </svg>
               </div>
		</div>

		<div class="login-container glow">
			<span>login.</span>
			<button class="btn-striped-shadow github" on:click={() => {window.location.href = 'http://localhost:3000/auth/github';}}>with github.</button>
			<button class="btn-striped-shadow google" on:click={() => {window.location.href = 'http://localhost:3000/auth/google';}}>with google.</button>
			<p on:click={() => ($token = 'DEV-MODE-ONLY')}>cant login?</p>
		</div>
	</main>
{/if}

<style>
	main {
		width: 100svw;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: 'Spock';
		user-select: none;
		z-index: 2;
		background: repeating-linear-gradient(135deg, transparent 0 5px, var(--pattern) 5px 10px);
		background-size: 200% 200%;
		background-position: 0% 0%;
		animation: stripes 120s linear infinite;
	}

	main::before {
		all: revert;
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 15%;
		z-index: -1;
		box-shadow: 0px -20px 20px 10px rgb(0 0 0 / 70%);
		background: var(--bg);
	}

	main::after {
		all: revert;
		content: '';
		position: absolute;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 20%;
		z-index: -1;
		background: rgba(241, 231, 53);
		mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 50px 100%;
	}

	span {
		color: var(--primary);
		text-shadow: rgba(241, 231, 53, 0.45) 0px 0px 35px;
		text-decoration: underline;
		text-align: center;
		font-size: 2rem;
		margin-bottom: max(7rem, 58%);
	}

	p {
		color: var(--hidden);
		font-size: 0.65rem;
		text-decoration: underline;
		cursor: pointer;
	}

	.login-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 90%;
		height: 90%;
		max-width: 20rem;
		max-height: 45rem;
		gap: 2rem;
		padding: 3rem;
		margin: 1rem;
		background-color: rgba(0, 0, 0, 0.13);
		border: 0.12rem dashed rgba(255, 255, 255, 0.12);
		border-radius: 0.75rem;
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5),
			inset 0 -1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0px 0px rgba(255, 255, 255, 0),
			0px 0px 40px 0px rgba(0, 0, 0, 1);
		position: relative;
		overflow: hidden;
		transition: transform 0.3s ease-in-out;
	}

	.glow {
		box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 1);
	}

	#artifacts {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		overflow: hidden;
	}

	#artifacts > * {
		position: absolute;
		height: auto;
		stroke: var(--primary);
		opacity: 1 !important;
		transform-origin: center;
	}

	#artifacts > div > svg {
          width: clamp(52px, 5vw, 65px);
          height: auto;
     }

     .float-wave {
          animation: wave var(--speed, 20s) linear infinite;
     }

     #artifacts > *:nth-child(odd) .float-wave {
       animation-delay: calc(var(--speed, 20s) / -2);
     }


	.shape-diamond { bottom: 32%; right: 10%; transform: rotate(45deg) scale(1.5); }
	.shape-plus { top: 65%; right: 21%; transform: rotate(-45deg) scale(1.3); }
	.shape-cross { top: 65%; left: 15%; transform: rotate(55deg) scale(1.1); }
	.shape-rectangle { top: 27%; left: 59%; transform: rotate(8deg) scale(1); }

	.shape-zigzag { bottom: 89%; left: 27%; transform: translateX(-50%) scale(1.3) rotate(-17deg); }
	.shape-zigzag-two { top: 55%; left: 20%; transform: rotate(10deg) scale(0.8); }
	.shape-zigzag-three { top: 51%; right: 10%; transform: rotate(-8deg) scale(0.9); }

	.shape-triangle { top: 57%; left: 8%; transform: rotate(-16deg) scale(1.45) }
	.shape-triangle-two { top: 15%; right: 9%; transform: scale(2.1) rotate(20deg) }
	.shape-hexagon { bottom: 22%; right: 8%; transform: rotate(-15deg) scale(1.4); }

	.shape-dottedcircle { bottom: 18%; left: 35%; transform: rotate(-15deg) scale(1.8); }
	.shape-orbit { bottom: 80%; right: 85%; transform: rotate(-96deg) scale(3); }

	.shape-dots { top: 70%; left: 10%; transform: scale(1.2); }
	.shape-dotgrid { bottom: 23%; left: 80%; transform: scale(1.4); }
	.shape-dotgrid-two { bottom: 71%; left: 78%; transform: scale(2); }

	.btn-striped-shadow {
		--btn-color: #333;
		display: inline-block;
		position: relative;
		overflow: visible;
		background-color: var(--btn-color);
		color: var(--accent);
		border-radius: 0.4rem;
		width: 100%;
		height: 48px;
		z-index: 1;
		cursor: pointer;
		line-height: 38px;
		letter-spacing: 1px;
		transition: opacity 0.3s, z-index 0.3s step-end, transform 0.3s;
	}

	.github {
		--btn-color: darkgreen;
	}

	.google {
		--btn-color: #353ff1;
		margin-bottom: auto;
	}

	.btn-striped-shadow:after,
	.btn-striped-shadow:before {
		content: '';
		display: block;
		position: absolute;
		z-index: 1;
		background-image: linear-gradient(
			135deg,
			transparent 0,
			transparent 5px,
			var(--btn-color) 5px,
			var(--btn-color) 10px,
			transparent 10px
		);
		border-radius: 0.75rem;
		transition: transform 0.3s, max-height 0.3s, width 0.3s;
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
			background-position: 100% 100%;
		}
	}

     @keyframes wave {
          0%   { transform: translateY(0) rotate(var(--rot, 0deg)); }
          25%  { transform: translateY(-6px) rotate(var(--rot, 0deg)); }
          50%  { transform: translateY(0) rotate(var(--rot, 0deg)); }
          75%  { transform: translateY(6px) rotate(var(--rot, 0deg)); }
          100% { transform: translateY(0) rotate(var(--rot, 0deg)); }
     }

	@media (max-width: 600px) {
		.glow {
			box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.35);
		}

		main::after {
			all: revert;
			content: '';
			position: absolute;
			z-index: -1;
			bottom: -1px;
			right: 0;
			width: 100%;
			height: 21%;
			background: rgba(241, 231, 53);
			mask: conic-gradient(from 135deg at top, #0000, #000 1deg 89deg, #0000 90deg) 50% / 50px 100%;
		}

	}

	@media(max-width: 700px) {
          #artifacts{ display: none; }
     }

	@media (max-width: 1050px) {
		.shape-dottedcircle, .shape-rectangle { display: none; }
	}

</style>
