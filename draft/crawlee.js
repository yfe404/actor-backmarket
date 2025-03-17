import { PlaywrightCrawler, Dataset } from 'crawlee';
import { firefox } from 'playwright';

const baseUrl = 'https://www.backmarket.fr'
const storeUrl = `${baseUrl}/fr-fr/l/ordinateur-fixe-reconditionne/42ad298c-4974-4bc8-b4e9-12d437326054?p=1`;

const crawler = new PlaywrightCrawler({
	headless: false,
    maxRequestRetries: 5,
	launchContext: {
        // default chromium
        launcher: firefox,
    },
    requestHandler: async ({ page, parseWithCheerio, request, enqueueLinks}) => {
        console.log('URL:', request.url);

		// We only want to enqueue the URLs from the start URL.
        if (request.label === 'start-url') {
            // enqueueLinks will add all the links
            // that match the provided selector.
            await enqueueLinks({
                // The selector comes from our earlier code.
                selector: 'div[data-qa=productCard] a',
				limit: 1, // limit the queue to 1 element during testing.
            });
			return;
        }

		await page.click('button:has-text("refuser")');
		await page.click('button:has-text("cifications techniques")');

		await page.waitForSelector('div[data-test=specs]');
		console.log("\n\nFOUND DATA!!\n\n");

		const $ = await parseWithCheerio();
		const specKeysElements = $('div[data-test=specs] span.body-1');
		const specValuesElements = $('div[data-test=specs] span.body-2');
		const priceValue = $('span[data-qa="productpage-product-price"]').first().text().trim();
		const originalPriceValue = $('.body-2-striked').first().text().trim();

		console.log(`price: ${priceValue}`)
		console.log(`original price: ${originalPriceValue}`)

		for (let i = 0; i < specKeysElements.length; ++i){
			const key = $(specKeysElements[i]).text().trim();
			const value = $(specValuesElements[i]).text().trim();
			console.log(`${key}: ${value}`)
		}

		const specs = $('div[data-test=specs]').text().split("\n\n");
		console.log(specs);
    },
	statisticsOptions: {
        saveErrorSnapshots: true,
    },
});

await crawler.addRequests([{
	url: storeUrl,
    label: 'start-url',
}]);

await crawler.run();
