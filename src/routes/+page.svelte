<script lang="ts">
	import { error } from '@sveltejs/kit';
	async function getMtaData() {
		const response = await fetch('api/mta?path=a');
		if (!response.ok) {
			let errorMessage = response.statusText;
			try {
				errorMessage = await response.json();
			} finally {
				throw error(response.status, errorMessage);
			}
		}
		return (await response.json()).feedEntities;
	}
</script>

{#await getMtaData()}
	<p>Loading...</p>
{:then entities}
	<pre>{JSON.stringify(entities, null, 2)}</pre>
{:catch error}
	<p>Error: {JSON.parse(error).message}</p>
{/await}
