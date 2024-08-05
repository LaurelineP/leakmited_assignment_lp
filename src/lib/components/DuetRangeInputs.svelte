<script lang="ts">
	export let value: number, onChange;
</script>

<div class = "duet-speed-input flex justify-between space-x-3 w-[50%]">
	<input
		on:change = {onChange}
		bind:value
		id 		= "roads__maxspeed__range"
		class 	= "rounded p-0.5 w-16 ml-2 outline-none cursor-pointer"
		type 	= "range"
		step 	= {5}
		min 	= {0}
		max 	= {130}
	/>

	<input
		on:change = {onChange}
		bind:value
		id 		= "roads__maxspeed__value"
		class 	= "rounded p-0.5 w-[40px] ml-2 outline-none cursor-pointer text-sm w-[20px]"
		type 	= "number"
		step 	= {5}
		min 	= {0}
		max 	= {130}
	/>
</div>
