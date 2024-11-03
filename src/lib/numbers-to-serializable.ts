export function numbersToSerializable(name: string, data: number[]): SerializableFile {
	return {
		name: name,
		data,
		date: new Date().toISOString(),
	};
}
