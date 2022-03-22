import type { AstroAdapter, AstroIntegration } from 'astro';

export function getAdapter(): AstroAdapter {
	return {
		name: '@astrojs/node',
		// This one has no server entrypoint and is mostly just an integration
		serverEntrypoint: '@astrojs/node/server.js',
		exports: ['handler'],
	};
}

export default function createIntegration(): AstroIntegration {
	return {
		name: '@astrojs/ssg',
		hooks: {
			'astro:config:done': ({ setAdapter }) => {
				setAdapter(getAdapter());
			}
		}
	};
}
