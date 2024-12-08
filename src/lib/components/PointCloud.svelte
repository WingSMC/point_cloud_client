<script lang="ts">
	import { env } from '$env/dynamic/public';
	import { CLASS_COLOR_MAP, CLASS_LABEL_MAP } from '$lib/label-map';
	import { POINT_FRAGMENT_SHADER, POINT_VERTEX_SHADER } from '$lib/shaders';
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	const {
		points,
	}: {
		points: number[];
	} = $props();

	let classes = $state([]);
	let cloudClass = $state<number | undefined>(undefined);
	let label = $derived(cloudClass === undefined ? '' : CLASS_LABEL_MAP[cloudClass]);
	let legendColor = $derived(cloudClass === undefined ? [0, 0, 0] : CLASS_COLOR_MAP[cloudClass]);
	const colors = $derived(classes.length ? classes.flatMap((c) => c) : points.map(() => 1.0));
	let canvasContainer = $state<HTMLDivElement>(null!);

	$effect(() => console.log(legendColor));

	let stopped = false;
	let renderer: THREE.WebGLRenderer;
	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let pointCloud: THREE.Points<
		THREE.BufferGeometry<THREE.NormalBufferAttributes>,
		THREE.ShaderMaterial,
		THREE.Object3DEventMap
	>;
	let scene: THREE.Scene;
	let geometry: THREE.BufferGeometry;

	onMount(() => {
		scene = new THREE.Scene();
		scene.add(new THREE.AxesHelper(0.5));

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

		canvasContainer.appendChild(renderer.domElement);

		camera = new THREE.PerspectiveCamera(
			50,
			canvasContainer.clientWidth / canvasContainer.clientHeight,
			0.1,
			1000,
		);
		const pos = camera.position;
		pos.x = pos.y = pos.z = 1.5;

		geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute([], 3));

		const material = new THREE.ShaderMaterial({
			uniforms: {
				pointSize: { value: 0.5 },
				cameraPos: { value: camera.position },
			},
			vertexShader: POINT_VERTEX_SHADER,
			fragmentShader: POINT_FRAGMENT_SHADER,
			vertexColors: true,
			transparent: true,
		});
		pointCloud = new THREE.Points(geometry, material);
		scene.add(pointCloud);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.autoRotate = true;
		controls.autoRotateSpeed = 5;

		animate(performance.now());
	});

	$effect(() => {
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
	});

	$effect(() => {
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
	});

	onDestroy(() => {
		stopped = true;
		controls.dispose();
		renderer.dispose();
	});

	$effect(() => {
		const binary = new Float32Array(points);
		classes = [];

		fetch(`${env.PUBLIC_API_URL!}/octetsegment`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
				'Access-Control-Allow-Origin': '*',
			},
			mode: 'cors',
			referrerPolicy: 'no-referrer',
			body: binary.buffer,
		})
			.then((response) => response.json())
			.then((res) => (classes = res.colors));
	});

	$effect(() => {
		const binary = new Float32Array(points);
		classes = [];

		fetch(`${env.PUBLIC_API_URL!}/octetclassify`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/octet-stream',
				'Access-Control-Allow-Origin': '*',
			},
			mode: 'cors',
			referrerPolicy: 'no-referrer',
			body: binary.buffer,
		})
			.then((response) => response.json())
			.then((res) => (cloudClass = res.detected_class_id));
	});

	let prevT = performance.now();
	function animate(t: DOMHighResTimeStamp) {
		if (stopped) return;
		requestAnimationFrame(animate);

		const dt = (t - prevT) / 1000;
		prevT = t;

		controls.update(dt);

		pointCloud.material.uniforms.cameraPos.value = camera.position;
		renderer.render(scene, camera);
	}
</script>

<svelte:window
	on:resize={() => {
		camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
	}}
/>

{#if points}
	<div class="h-full w-full cursor-grab" bind:this={canvasContainer}></div>
{:else}
	<p>Loading...</p>
{/if}

<div
	class="bg-surface-100-800-token absolute right-4 top-4 flex min-w-52 items-center justify-start gap-4 rounded-md p-4 text-center font-bold capitalize"
>
	<div
		class="h-4 w-4 rounded-full"
		style={`background-color: rgb(${legendColor.map((c) => Math.round(c * 255)).join(' ')})`}
	></div>
	{label}
</div>
