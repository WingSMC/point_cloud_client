<script lang="ts">
	import { POINT_FRAGMENT_SHADER, POINT_VERTEX_SHADER } from '$lib/shaders';
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	export let pointCloudData: Float32Array;

	// const labelToColor = {
	// 	0: 0xffffff,
	// 	1: 0xff0000,
	// 	2: 0x00ff00,
	// 	3: 0x0000ff
	// };

	let stopped = false;
	let canvasContainer: HTMLDivElement;
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
		scene.add(new THREE.AxesHelper(1));

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);

		canvasContainer.appendChild(renderer.domElement);

		camera = new THREE.PerspectiveCamera(
			75,
			canvasContainer.clientWidth / canvasContainer.clientHeight,
			0.1,
			1000
		);
		const pos = camera.position;
		pos.x = pos.y = pos.z = 2;

		const points = [];
		const colors: number[] = [];
		const scale = 2;

		for (let i = 0; i < pointCloudData.length; i += 3 /* 4 */) {
			const x = pointCloudData[i] * scale;
			const y = pointCloudData[i + 1] * scale;
			const z = pointCloudData[i + 2] * scale;
			// const label = pointCloudData[i + 3];

			points.push(x, y, z);
			const color = new THREE.Color(
				/*labelToColor[label as keyof typeof labelToColor] ||*/ 0xffffff
			);
			colors.push(color.r, color.g, color.b);
		}

		geometry = new THREE.BufferGeometry();
		geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		const material = new THREE.ShaderMaterial({
			uniforms: {
				pointSize: { value: 0.5 },
				cameraPos: { value: camera.position }
			},
			vertexShader: POINT_VERTEX_SHADER,
			fragmentShader: POINT_FRAGMENT_SHADER,
			vertexColors: true,
			transparent: true
		});
		pointCloud = new THREE.Points(geometry, material);
		scene.add(pointCloud);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.autoRotate = true;
		controls.autoRotateSpeed = 5;

		animate(performance.now());
	});

	onDestroy(() => {
		console.log('destroying');

		stopped = true;
		controls.dispose();
		renderer.dispose();
	});

	let prevT = performance.now();
	function animate(t: DOMHighResTimeStamp) {
		if (stopped) return;
		requestAnimationFrame(animate);

		const dt = (t - prevT) / 1000;
		prevT = t;

		controls.update(dt);

		// geometry.setAttribute(
		// 	'color',
		// 	new THREE.Float32BufferAttribute(
		// 		geometry
		// 			.getAttribute('color')
		// 			.array.map((c) => Math.max(0.0, Math.min(1.0, c + (Math.random() - 0.5) * 0.05))),
		// 		3
		// 	)
		// );
		pointCloud.material.uniforms.cameraPos.value = camera.position;
		renderer.render(scene, camera);
	}

	const handleResize = () => {
		camera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
	};
</script>

<svelte:window on:resize={handleResize} />

{#if pointCloudData}
	<div class="h-full w-full cursor-grab" bind:this={canvasContainer}></div>
{:else}
	<p>Loading...</p>
{/if}
