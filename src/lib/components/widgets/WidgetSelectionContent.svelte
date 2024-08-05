<script lang="ts">
	export let data;
	$: roads = data.roads;
</script>

<div class="p-5 min-h-[300px]">
	{#if roads === null}
		<span class="text-gray-400">- no road selected -</span>
	{:else}
		<!-- from road I need entries - how to do  -->
		{#each roads as road}
			<div class="border rounded p-5 my-2">
				<h2><strong>{road.name || '-- UNKNOWN --'}</strong></h2>
				<hr />
				{#each Object.entries(road) as [key, value]}
					<div class="px-2 text-sm">
						{#if key !== 'name' && value !== ''}
							<span
								>{key}:
								<strong>{value == 'F' ? 'false' : value == 'T' ? 'true' : value}</strong></span
							>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>
