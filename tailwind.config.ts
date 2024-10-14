import { skeleton } from '@skeletonlabs/tw-plugin';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { join } from 'node:path';
import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: 'media',

	content: [
		'./src/**/*.{html,js,svelte,ts}', // 3. Append the path to the Skeleton package
		join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],

	theme: {
		extend: {}
	},

	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: [{ name: 'crimson', enhancements: true }]
			}
		})
	]
};

export default config;
