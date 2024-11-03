export function ptsToNumbers(buf: ArrayBuffer | string): Array<number> {
	const text = typeof buf === 'string' ? buf : new TextDecoder().decode(buf);
	const floats = text.trim().split(/\s+/).map(parseFloat);
	return floats;
}
