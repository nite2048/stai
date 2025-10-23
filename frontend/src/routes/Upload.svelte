<script>
    import { onMount } from "svelte";
    import Card from "../lib/Card.svelte";

     let fileInput, preview, lastUrl, statusMessage = '', previewImage = false, isLoading = false, data;

     async function uploadImage(e) {
          e.preventDefault();
          const file = fileInput.files[0];

          if (!file) {
               statusMessage = 'Please select a file.';
               return;
          }

          isLoading = true;
          statusMessage = 'Uploading...';
          const formData = new FormData();
          formData.append('image', file);

          await postImage(formData);
          isLoading = false;
          removeImage();
     }

     async function postImage(formData) {
          try {
               const res = await fetch('http://localhost:3000/tests/upload', { method: 'POST', body: formData });
               if (!res.ok) throw new Error(`Upload with status ${res.status}`);

               data = await res.json();
               statusMessage = data.message || 'Upload successful';
          } catch (err) {
               statusMessage = `Error: ${err.message}`;
          }
     }

     function removeImage(){
          if (lastUrl) {
               URL.revokeObjectURL(lastUrl);
               lastUrl = undefined;
          }

          preview.innerHTML = ''
          preview.style.background = "var(--bg)"
          previewImage = false;
     }

     function onChange(e) {
          if (lastUrl) {
               URL.revokeObjectURL(lastUrl);
               lastUrl = undefined;
          }

          preview.innerHTML = ''

          const file = e.target.files  && e.target.files[0];
          if (!file) return;

          if (!file || !file.type.startsWith("image/")) return;
          lastUrl = URL.createObjectURL(file);

          const img = document.createElement("img");
          img.src = lastUrl;
          img.alt = file.name;
          img.style.maxHeight = "100%";
          img.style.borderRadius = ".75rem";

          preview.appendChild(img);
          preview.style.backgroundImage = "repeating-linear-gradient(135deg, transparent 0 5px, var(--faded-primary) 5px 10px)"
          preview.style.backgroundRepeat = "repeat";
          previewImage = true;
     }

     onMount(() => {
          preview = document.getElementById('preview')
          const input = document.querySelector('input[type="file"]')

          if (input) input.addEventListener("change", onChange);
     })

</script>

{#if data}
<main>
     <Card displayData={data}/>
</main>
{:else}
<main>
     <div id="preview">
          {#if previewImage}
               <button id="close" type="button" on:click={removeImage} disabled={isLoading}>×</button>
          {/if}
     </div>
	<form on:submit={uploadImage}>
	      <label style="display: {previewImage ? 'none' : 'flex'};" for="fileInput" class="upload">
	           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342.219 342.219" class="upload-icon">
	                <path d="M180.52 107.507c-4.988-4.99-13.825-4.99-18.813 0l-50.892 50.893c-5.197 5.197-5.197 13.618 0 18.814s13.623 5.196 18.814 0l28.179-28.182v111.273c0 7.348 5.958 13.305 13.305 13.305s13.305-5.957 13.305-13.305V149.033l28.184 28.182c2.596 2.6 6.002 3.898 9.406 3.898s6.812-1.299 9.406-3.898c5.197-5.197 5.197-13.617 0-18.814l-50.894-50.894z"/></svg>
	           <input type="file" id="fileInput" bind:this={fileInput} accept="image/*" hidden/>
	           <p class="word">Drag or click to upload</p>
	      </label>

	      {#if !previewImage}
	           <button class="upload" style="display: none;" type="submit">Upload</button>
	      {:else}
	           <button class="upload" type="submit" disabled={isLoading}>
	                {#if isLoading}Uploading...{:else}Upload {preview.getElementsByTagName("img")[0].alt}{/if}
	           </button>
	      {/if}
	 </form>
</main>
{/if}



<style>
     *{
          color: white;
     }

     #close {
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -50%);
          width: 1.5rem;
          height: 1.5rem;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: rgba(255,255,255,0.08);
          color: var(--accent);
          font-size: 16px;
          line-height: 1;
          border-radius: 50%;
          cursor: pointer;
     }

     #close:hover {
          background: rgba(255,255,255,0.12);
     }

     #close:active {
          background: var(--primary);
     }

     main{
          width: 100svw;
          height: 100svh;
          background-color: var(--bg);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1rem
     }

     form{
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          flex-direction: column;
     }

     .upload{
          width: 90%;
          min-width: 18rem;

          padding: 1rem;

          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;

          border: .12rem dashed rgba(255,255,255,.12);
          border-radius: .75rem;

          cursor: pointer;

          background: var(--bg);
          color: var(--accent);

          box-sizing: border-box;
     }

     .upload svg{
          width:2.4rem;
          height:2.4rem;
          color: var(--primary);
          fill: var(--primary);
          padding-bottom: 5px;
          flex:0 0 auto
     }

     #preview{
          width: 90%;
          min-width: 15rem;
          height: 60%;
          min-height: 15rem;
          font-size: 1.5rem;

          margin-top: 1rem;

          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;

          border: 0.12rem dashed rgba(255,255,255,.12);
          border-radius: 0.75rem;

          background: var(--bg);
          color: var(--accent);

          box-sizing: border-box;
          flex: 3;
     }

     .word {
       position: relative;
       text-shadow: .1em 0.1em 0 rgba(0, 0, 0, 0.6),  .08em 0.08em 0 rgba(0, 0, 0, 0.6);
       z-index: 2;
     }

     .word:before {
       background-color: var(--fade);
       content: " ";
       height: 40%;
       position: absolute;
       left: 3.5%;
       top: 50%;
       width: 98%;
       z-index: -1;
     }

     @media (max-width:460px){
          .upload svg{
               width: 1.9rem;
               height: 1.9rem
          }

          .upload{
               font-size: 1.1rem;
               gap: 0.15rem
          }
     }
</style>
