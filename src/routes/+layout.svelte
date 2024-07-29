<script>
	import "../app.css";
	export let data;
	$: doubled = data.one * 2;
</script>




<div class = 'flex flex-col items-center'>
	<slot/>
</div>




<style lang="postcss">
	:global(html) {
	  /* background-color: theme(colors.cyan.100); */
	  background-color: #141c24;
	}
	:global(body){
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: #333;
	}

</style>