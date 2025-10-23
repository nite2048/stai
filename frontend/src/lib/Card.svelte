<script lang="ts">
  import { onMount } from 'svelte';

  export let displayData: any;

  $: title = displayData.title || { name: '', originalName: '', transliteratedName: '' };
  $: description = displayData.description || '';
  $: category = displayData.category || '';
  $: genres = displayData.genres || [];
  $: startDate = displayData.startDate || '';
  $: averageScore = displayData.averageScore || 0;
  $: coverImage = displayData.coverImage || '';

  $: formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'N/A';
</script>

{#if Object.keys(displayData).length > 0}
  <div class="card-container">
    <div class="card yellow-dashed-border">
      <div class="cover-image-wrapper">
        <img src={coverImage} alt={title.name} class="cover-image" />
        <div class="category-badge">{category.toUpperCase()}</div>
      </div>
      <div class="content">
        <h1 class="title">{title.name}</h1>
        {#if title.originalName && title.originalName !== title.name}
          <p class="subtitle">({title.originalName} - {title.transliteratedName})</p>
        {/if}
        <p class="description">{description}</p>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Genres:</span>
            <span>{genres.join(', ')}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Release:</span>
            <span>{formattedStartDate}</span>
          </div>
          <div class="detail-item score-item">
            <span class="detail-label">Score:</span>
            <span class="score">{averageScore}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <p class="loading-message yellow-dashed-border">Loading anime data...</p>
{/if}

<style>
  :global(body) {
    background-color:black; /* Dark background for the entire page */
    color: #e0e0e0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  .loading-message {
    font-size: 1.2em;
    color: #888;
    padding: 20px 40px; /* Added padding for dashed border visibility */
    background-color: black; /* Dark background for the message */
    border-radius: 8px;
  }

  /* Yellow Dashed Border Theme */
  .yellow-dashed-border {
    border: 2px dashed #ffc107 !important; /* Yellow dashed border */
  }

  .card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
  }

  .card {
    display: flex;
    flex-direction: row;
    background-color: black;
    border-radius: 8px;
    overflow: hidden;
    max-width: 900px;
    width: 100%;
    color: #e0e0e0;
    transition: all 0.2s ease-in-out;
    /* Removed default border and shadow, now handled by .yellow-dashed-border */
  }


  .cover-image-wrapper {
    position: relative;
    flex-shrink: 0;
    width: 280px;
    height: 400px;
    overflow: hidden;
    border-radius: 8px 0 0 8px;
  }

  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .category-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    background-color: #ffc107; /* Yellow badge */
    color: black; /* Dark text on yellow */
    padding: 5px 12px;
    border-radius: 5px;
    font-size: 0.8em;
    font-weight: bold;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  .content {
    padding: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
  }

  .title {
    font-size: 2.2em;
    font-weight: 600;
    margin-bottom: 8px;
    color: #ffc107; /* Yellow title */
    line-height: 1.2;
  }

  .subtitle {
    font-size: 1em;
    font-style: italic;
    color: #ccc; /* Slightly lighter gray */
    margin-bottom: 25px;
  }

  .description {
    font-size: 1em;
    line-height: 1.5;
    margin-bottom: 30px;
    color: #e0e0e0; /* Default text color */
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    font-size: 0.9em;
  }

  .detail-item {
    background-color: #282828;
    padding: 10px 15px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid #444; /* Darker border for contrast with yellow dashed */
  }

  .detail-label {
    color: #ffc107; /* Yellow label */
    font-weight: 500;
    margin-bottom: 3px;
    font-size: 0.85em;
  }

  .score-item .score {
    font-size: 1.1em;
    font-weight: bold;
    color: black; /* White score text */
    background-color: #ffc107; /* Yellow background for score */
    padding: 3px 8px;
    border-radius: 4px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .card {
      flex-direction: column;
      max-width: 400px;
    }

    .cover-image-wrapper {
      width: 100%;
      height: 350px;
      border-radius: 8px 8px 0 0;
    }

    .content {
      padding: 25px;
    }

    .title {
      font-size: 1.8em;
      text-align: center;
    }

    .subtitle {
      text-align: center;
    }

    .details-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
