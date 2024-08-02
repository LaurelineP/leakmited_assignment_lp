<script>
	import logo from '$lib/assets/logo.png';
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
		? 'h-screen rounded absolute'
		: 'h-min w-min m-2.5 rounded-full justify-center absolute z-10';
	$: panelClass = isMainLayout ? dashboardPanelClass: regularPanelClass;

	$: dashboardHeaderClass = isDashboardOpen 
		? 'w-full bg-[#219EBC] rounded-tr' : ''

	const panelBaseClass = 'Panel flex flex-col shadow-xl box-border items-center backdrop-blur-sm border-white bg-white/90'

	const toggleSidePanel = () => {
		isOpen = !isOpen;
	}

	$: iconComponent = isOpen ?  X : Menu;
</script>


<div
	class = "{panelBaseClass} {panelClass} {extraClass}">


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
				<img src = {logo} alt = "company's visual representation" class = "w-40 mx-5" />
			{/if}
		{/if}
	</div>
	

	<!-- /* ------------------------------ PANEL CONTENT ----------------------------- */ -->
	{#if isDashboardOpen || !isMainLayout }
		<div class = "PanelContent m-3 overflow-y-auto h-[100%] ">
			<slot />
		</div>
	{/if}
</div>
