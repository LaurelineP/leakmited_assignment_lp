<script lang='ts'>
	export let name: string, id: string, accept:string;

	const onDrop = (e) => {
		e.preventDefault()
	}
</script>


<div
	class = "ImportBox rounded-sm outline-dashed h-36 outline-sky-500 border-1 w-100"
	on:drop = { onDrop }
	role 	= "region"
    aria-label = "File drop zone"
>
	<input
		class 	= "border-0 outline-none cursor-pointer m-5"
		type 	= "file"
		{id}
		{name}
		{accept}
	/>	
</div>
