// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	type SerializableFile = {
		name: string;
		date: string;
		data: number[];
	};
}

declare module '$env/static/public' {
	export const PUBLIC_API_URL: string;
}

export {};
