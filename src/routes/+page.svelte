<script lang="ts">
	import PointCloud from '$lib/components/PointCloud.svelte';
	import { ptsToFloat32Array } from '$lib/pts-to-float32-array';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		Drawer,
		FileDropzone,
		getDrawerStore,
		ListBox,
		ListBoxItem
	} from '@skeletonlabs/skeleton';
	import Fegyver from '../test/fegyver.pts?raw';
	import Lampa from '../test/lampa2.pts?raw';

	const drawer = getDrawerStore();

	const files = $state([new File([Fegyver], 'fegyver.pts'), new File([Lampa], 'Lampa.pts')]);

	function openDrawer() {
		drawer.open({
			position: 'left',
			// Provide your property overrides:
			bgBackdrop: 'bg-gradient-to-tr from-primary-500/50 to-tertiary-500/50',
			width: 'w-full md:w-1/2',
			padding: 'p-2',
			rounded: 'rounded-xl'
		});
	}

	function fileUpload(e: Event) {
		const { files: fs } = e.target as HTMLInputElement;
		if (!fs || fs.length === 0) return;
		files.push(fs[0]);
		fileIndex = files.length - 1;
	}

	//let ptsFile: undefined | FileList;
	let fileIndex = $state<undefined | number>(undefined);
	let file = $derived<undefined | File>(fileIndex === undefined ? undefined : files[fileIndex]);
	const pointCloudPromise = $derived(file && ptsToFloat32Array(file));
</script>

<Drawer>
	<div class="grid overflow-y-auto p-3">
		<ListBox class="grid">
			{#each files as f, value (f)}
				<ListBoxItem class="!rounded-md" name="file" bind:group={fileIndex} {value}>
					{files[value].name}
					<svelte:fragment slot="trail">(icon)</svelte:fragment>
				</ListBoxItem>
			{:else}
				<div>You have no files uploaded</div>
			{/each}
		</ListBox>
	</div>
</Drawer>

<div class="grid min-h-full grid-rows-[max-content_1fr]">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">
			<button onclick={openDrawer}>
				<Icon class="size-6" icon="fluent:panel-left-48-filled" />
			</button>
		</svelte:fragment>
		<h1 class="h4">Pointcloud segmentation with GNNs</h1>
	</AppBar>

	{#if pointCloudPromise}
		{#await pointCloudPromise}
			<p>Loading...</p>
		{:then pointCloudData}
			<PointCloud {pointCloudData} />
		{:catch error}
			<p>{error.message}</p>
		{/await}
	{:else}
		<div class="grid h-full place-items-center">
			<FileDropzone
				class="w-max !rounded-lg !px-20"
				name="pts"
				accept=".pts"
				on:change={fileUpload}
				required
			>
				<svelte:fragment slot="lead">
					<Icon icon="mdi:file-upload-outline" class="mx-auto size-10" />
				</svelte:fragment>
				<svelte:fragment slot="message">
					<div class="flex justify-center">Point Cloud (.pts)</div>
				</svelte:fragment>
			</FileDropzone>
		</div>
	{/if}
</div>
