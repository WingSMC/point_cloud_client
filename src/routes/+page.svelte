<script lang="ts">
	import PointCloud from '$lib/components/PointCloud.svelte';
	import { fileStore } from '$lib/store.svelte';
	import Icon from '@iconify/svelte';
	import {
		AppBar,
		Drawer,
		FileDropzone,
		getDrawerStore,
		ListBox,
		ListBoxItem,
	} from '@skeletonlabs/skeleton';

	const drawer = getDrawerStore();

	function openDrawer() {
		drawer.open({
			position: 'left',
			bgBackdrop: 'bg-gradient-to-tr from-primary-500/50 to-tertiary-500/50',
			width: 'w-full md:w-1/2 2xl:w-1/4',
			padding: 'p-2',
			rounded: 'rounded-xl',
		});
	}

	function fileUpload(e: Event) {
		const { files: fs } = e.target as HTMLInputElement;
		if (!fs || fs.length === 0) return;
		fileStore.add(fs[0]);
	}
</script>

<Drawer>
	<div class="grid gap-3 overflow-y-auto p-3">
		<ListBox class="grid">
			{#each fileStore.files as f, value (f)}
				<ListBoxItem
					class="!rounded-md"
					name="file"
					bind:group={fileStore.currentFileIndex}
					{value}
				>
					<div class="flex w-full justify-between">
						<span>{f.name}</span>
						<span>{new Date(f.date).toDateString()}</span>
					</div>
					<svelte:fragment slot="trail">
						<Icon icon="fluent:delete-24-regular" onclick={() => fileStore.remove(value)} />
					</svelte:fragment>
				</ListBoxItem>
			{:else}
				<span class="text-center font-bold h5">You have no files uploaded</span>
			{/each}
		</ListBox>
		<FileDropzone
			class="w-full !rounded-lg !py-3"
			name="pts"
			accept=".pts"
			on:change={fileUpload}
			required
		>
			<svelte:fragment slot="message">
				<Icon icon="basil:add-outline" class="size-7" />
			</svelte:fragment>
		</FileDropzone>
	</div>
</Drawer>

<div class="grid min-h-full grid-rows-[max-content_1fr]">
	<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
		<svelte:fragment slot="lead">
			<button onclick={openDrawer}>
				<Icon class="size-6" icon="fluent:panel-left-48-filled" />
			</button>
		</svelte:fragment>
		<h1 class="h4 whitespace-nowrap">
			{fileStore.currentFile ? fileStore.currentFile.name : 'Pointcloud segmentation with GNNs'}
		</h1>
	</AppBar>

	{#if fileStore.currentFile}
		<PointCloud points={fileStore.currentFile.data} />
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
