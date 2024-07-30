<script>
	import "../app.css";
</script>




<div class = 'svelte-layout flex flex-col items-center'>
	<slot/>
</div>




<style lang="postcss">
	:global(html) {
	  background-color: #EEE;
	}
	:global(body){
		height: 100vh;
		display: flex;
		flex-direction: column;
		color: #333;
	}
</style>