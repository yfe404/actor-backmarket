import { gotScraping } from 'got-scraping';
import * as cheerio from 'cheerio';
const baseUrl = 'https://www.backmarket.fr'
const storeUrl = `${baseUrl}/fr-fr/l/ordinateur-fixe-reconditionne/42ad298c-4974-4bc8-b4e9-12d437326054?p=0`;

// Download HTML with Got Scraping
const response = await gotScraping(storeUrl);
const html = response.body;
const results = [];

const $ = cheerio.load(html);
const products = $('div[data-qa=productCard]');

for (let product of products) {
	const productElement = $(product);
	const urlElement = $(product).find('a')
	const url = $(urlElement).attr("href");
    const productText = productElement.text();
	if (url.startsWith('/fr-fr/p/')) {
		results.push(baseUrl + url);
	}
}

for (let url of results) {
	try {
		const productResponse = await gotScraping(url);
		const productHtml = productResponse.body;

		const $productPage = cheerio.load(productHtml);
		const productPageTitle = $productPage('h1').text().trim();

		console.log(productPageTitle);
	} catch (error) {
		console.error(error.message, url);
	}
}
