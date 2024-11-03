import { browser } from '$app/environment';
import { fileToSerializable } from './file-to-serializable';

class FileStore {
	readonly #KEY = 'PTS_FILES';
	readonly #files = $state(this.loadFilesFromLocalStorage());
	#currentFileIndex = $state<number | undefined>(undefined);
	readonly #currentFile = $derived.by(() =>
		this.#currentFileIndex !== undefined ? this.#files[this.#currentFileIndex] : undefined,
	);

	loadFilesFromLocalStorage(): SerializableFile[] {
		const str = browser ? localStorage.getItem(this.#KEY) : null;
		return str ? JSON.parse(str) : [];
	}

	get files() {
		return this.#files;
	}

	async add(file: File) {
		const f = await fileToSerializable(file);
		this.#files.push(f);
		this.#currentFileIndex = this.#files.length - 1;
		localStorage.setItem(this.#KEY, JSON.stringify(this.#files));
	}

	remove(i: number) {
		this.#files.splice(i, 1);

		if (this.#currentFileIndex === i) {
			this.#currentFileIndex = this.#files.length ? (i > 0 ? i - 1 : 0) : -1;
		}

		localStorage.setItem(this.#KEY, JSON.stringify(this.#files));
	}

	get currentFileIndex() {
		return this.#currentFileIndex;
	}

	set currentFileIndex(i: number | undefined) {
		this.#currentFileIndex = i;
	}

	get currentFile() {
		return this.#currentFile;
	}
}

export const fileStore = new FileStore();
