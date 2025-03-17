import { firefox} from 'playwright';
import { load } from 'cheerio';


const url = 'https://www.backmarket.fr/fr-fr/p/imac-24-mi-2021-m1-32ghz-ssd-256-go-16-go-azerty-francais/71bd38fd-afb3-458d-a05e-824eb12ed66f?l=10';



//a3Lbf4","url":"https://www.backmarket.fr/fr-fr/p/imac-24-mi-2021-m1-32ghz-ssd-256-go-16-go-azerty-francais/71bd38fd-afb3-458d-a05e-824eb12ed66f#l=10

const browser = await firefox.launch({ headless: false});

// Open a new page
const page = await browser.newPage();

// Visit Google
await page.goto(url);

await page.click('button:has-text("refuser")');
await page.click('button:has-text("cifications techniques")');

//await page.waitForSelector('li button.items-start');
//const element = await page.locator('li button.items-start').first().click();	

await page.waitForSelector('div[data-test=specs]');
console.log("\n\nFOUND DATA!!\n\n");

const $ = load(await page.content());

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

// wait for 10 seconds before shutting down
await page.waitForTimeout(10000);

await browser.close();



