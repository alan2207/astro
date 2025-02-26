import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';

describe('build.format', () => {
	describe('directory', () => {
		/** @type {import('./test-utils').Fixture} */
		let fixture;
		before(async () => {
			fixture = await loadFixture({
				root: './fixtures/page-format/',
			});
		});

		describe('Build', () => {
			before(async () => {
				await fixture.build();
			});

			it('relative urls created point to sibling folders', async () => {
				let html = await fixture.readFile('/nested/page/index.html');
				let $ = cheerio.load(html);
				expect($('#another').attr('href')).to.equal('/nested/page/another/');
			});
		});
	});

	describe('file', () => {
		/** @type {import('./test-utils').Fixture} */
		let fixture;
		before(async () => {
			fixture = await loadFixture({
				root: './fixtures/page-format/',
				build: {
					format: 'file',
				},
			});
		});

		describe('Build', () => {
			before(async () => {
				await fixture.build();
			});

			it('relative urls created point to sibling folders', async () => {
				let html = await fixture.readFile('/nested/page.html');
				let $ = cheerio.load(html);
				expect($('#another').attr('href')).to.equal('/nested/another/');
			});
		});
	});

	describe('preserve', () => {
		/** @type {import('./test-utils').Fixture} */
		let fixture;
		before(async () => {
			fixture = await loadFixture({
				base: '/test',
				root: './fixtures/page-format/',
				trailingSlash: 'always',
				build: {
					format: 'preserve',
				},
				i18n: {
					locales: ['en'],
					defaultLocale: 'en',
					routing: {
						prefixDefaultLocale: true,
						redirectToDefaultLocale: true,
					},
				},
			});
		});

		describe('Build', () => {
			before(async () => {
				await fixture.build();
			});

			it('relative urls created point to sibling folders', async () => {
				let html = await fixture.readFile('/en/nested/page.html');
				let $ = cheerio.load(html);
				expect($('#another').attr('href')).to.equal('/test/en/nested/another/');
			});

			it('index files are written as index.html', async () => {
				let html = await fixture.readFile('/en/nested/index.html');
				let $ = cheerio.load(html);
				expect($('h1').text()).to.equal('Testing');
			});
		});
	});
});
