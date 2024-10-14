<script>
	import { autoModeWatcher, initializeStores } from '@skeletonlabs/skeleton';
	import '../app.css';

	initializeStores();
</script>

<svelte:head>
	{@html '<script>(' + autoModeWatcher.toString() + ')();</script>'}
</svelte:head>

<slot></slot>
