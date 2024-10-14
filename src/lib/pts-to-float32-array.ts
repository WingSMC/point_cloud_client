export async function ptsToFloat32Array(pts: File): Promise<Float32Array> {
	const buf = await pts.arrayBuffer();
	const text = new TextDecoder().decode(buf);

	const floats = text.trim().split(/\s+/).map(parseFloat);

	return new Float32Array(floats);
}
