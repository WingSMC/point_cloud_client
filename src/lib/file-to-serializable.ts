import { numbersToSerializable } from './numbers-to-serializable';
import { ptsToNumbers } from './pts-to-numbers';

export async function fileToSerializable(f: File) {
	return numbersToSerializable(f.name, ptsToNumbers(await f.arrayBuffer()));
}
