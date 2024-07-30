<script>
	import { Menu, X } from 'lucide-svelte';

	let {
		extraClass = null,
		isClosable = false,
		isOpen = false,
		isMainLayout = false,
		title = ''
	} = $$props;
	$: isDashboardOpen = isMainLayout && isOpen 
	/* ------------------------------- STYLE LOGIC ------------------------------ */
	const regularPanelClass = 'rounded absolute';
	$: dashboardPanelClass = isDashboardOpen 
		? 'h-100 rounded'
		: 'h-min w-min m-2.5 rounded-full justify-center absolute z-10';
	$: panelClass = isMainLayout ? dashboardPanelClass: regularPanelClass;

	$: dashboardHeaderClass = isDashboardOpen 
		? 'w-full bg-[#219EBC] rounded-tr' : ''


	const toggleSidePanel = () => {
		isOpen = !isOpen;
	}

	$: iconComponent = isOpen ?  X : Menu;
</script>

<div
	class = "Panel bg-slate-100 flex flex-col shadow-xl box-border items-center {panelClass} {extraClass}">


	 <!-- /* ------------------------------ PANEL HEADER ------------------------------ */ -->
	<div
		class = "Panel_header flex items-center { dashboardHeaderClass }">
		{#if isClosable }
			<button
				on:click = { toggleSidePanel }
				class = '{ isOpen ? 'p-2 text-white hover:animate-spin' : '' }'>
				<svelte:component
					this 		= { iconComponent }
					strokeWidth = { 2 }
					size 		= { 26 }
					class		= "m-2"
				/>
			</button>
			{#if isDashboardOpen && title }
				<h1 class = "Panel_title uppercase ml-10 text-white flex w-100">
					{title}
				</h1>
			{/if}
		{/if}
	</div>
	

	<!-- /* ------------------------------ PANEL CONTENT ----------------------------- */ -->
	{#if isDashboardOpen || !isMainLayout }
		<div class = "PanelContent m-3 overflow-y-auto h-[100%]">
			<slot />
		</div>
	{/if}
</div>
