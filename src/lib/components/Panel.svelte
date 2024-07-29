<script>
	import { Menu, X } from 'lucide-svelte';
	let isClosed = true;
	$: restClss = !isClosed
		? 'h-100 items-start rounded'
		: 'h-min w-10 m-3 rounded-full justify-center items-center absolute z-10';

	const toggleSidePanel = () => {
		isClosed = !isClosed
	}

	$: iconComponent = isClosed ?  Menu : X;
</script>


<div
	class = "Panel bg-slate-100 h-full flex flex-col shadow-lg {restClss}"
	>
	<div class = "flex items-center {!isClosed ? 'w-full bg-cyan-600 rounded-tr' : null}">
		<button
			on:click = { toggleSidePanel }
			class = '{ !isClosed ? 'p-2 text-white' : null }'>
			<svelte:component
				this 		= { iconComponent }
				strokeWidth = { 2 }
				size 		= { 26 }
				class		= "m-2"
			/>
		</button>
		{#if !isClosed }
			<h1 class = "uppercase bold tracking-[.5em] ml-10 text-white">
				Leakmited
			</h1>
		{/if}
	</div>

	{#if !isClosed }<slot/>{/if}
</div>
