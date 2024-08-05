<script lang="ts">
	import type { WidgetMapData } from '$lib/utils/types/app-data.types';
	import PieChart from '../PieChart.svelte';

	export let data: WidgetMapData;
</script>

<div class="text-sm">
	<span class="text-xs text-gray-400 mono italic">*current viewport info</span>
	<div class="ml-8 my-5">
		<!-- map zoom state -->
		{#if data?.zoom !== undefined}
			<p>current zoom: <span><b>{data?.zoom}</b></span></p>
		{/if}

		<!-- map zoom state -->
		{#if data?.minSpeed}
			<p>selected speed: <span><b>{`>= ${data?.minSpeed}`}</b></span></p>
		{/if}

		<!-- graph x percentages -->
		{#if !!data?.percentages?.length}
			<PieChart bind:data />
		{/if}
	</div>
</div>
