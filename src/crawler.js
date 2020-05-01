const puppeteer = require('puppeteer');
const HashMap = require('hashmap');
const mysql = require('mysql');
const mysql_config = require('./mysqlconfig.js');

const MAX_PAGE = 20;
const START_PAGE = 'https://www.adidas.com/us/superstar-shoes/EG4958.html';
var queue = [];
const BASE_URL = 'https://www.adidas.com';
var page;
var hashmap = new HashMap();
var counter;

var connection = mysql.createConnection(mysql_config);
connection.connect();

let start = async function(){
	const browser = await puppeteer.launch({headless: false, defaultViewport: null, args:['--start-fullscreen']});
	page = await browser.newPage();

	counter = 0;
	queue.push(START_PAGE);
	while(queue.length > 0 && counter <= MAX_PAGE){
		let url = queue.shift();
		await getProductInfo(url);
	}	
	await browser.close();
	await process.exit();
}

let getProductInfo = async function(url){
	let name = '';
	let price = '';
	let id = '';
	let picture = '';
	try{
		await page.goto(url);
		let urls = url.split('/');
		id = urls[urls.length-1].split('.')[0];
		name = await page.$eval('h1.product_title', el => el.innerText);
		price = await page.$eval('[data-auto-id="product-information"] .gl-price__value', el => el.innerText);
		picture = await page.$eval('[data-auto-id="view_0"]', el => el.src);
		hashmap.set(id);
	} catch (e) {
		return;
	}

	debugger;
	console.log('---------------');
	console.log('ID ', id);
	console.log('NAME ', name);
	console.log('PRICE ', price);

	// Highlights
	let highlights_body = '';
	try{
		const highlights = await page.waitForSelector('li[title="Highlights"]', {timeout: 1000});
		await highlights.click();
		highlights_body = await page.$eval('div[class*="tab_container"]', el => el.innerHTML);
	} catch (e) {
		console.log('no highlights_body');
	}

	// Description
	let description_body = '';
	try{
		const description = await page.waitForSelector('li[title="Description"]', {timeout: 1000});
		await description.click();
		description_body = await page.$eval('div[class*="desktop_product_details"]', el => el.innerHTML);
	} catch (e) {
		console.log('no description_body');
	}

	// Specificaiton 
	let specification_body = '';
	try{
		const specification = await page.waitForSelector('li[title="Specifications"]', {timeout: 1000});
		await specification.click();
		specification_body = await page.$eval('div[class*="specifications_content"]', el => el.innerHTML);
	} catch (e) {
		console.log('no specification_body');
	}

	// Product Story 
	let story_body = '';
	try{
		const story = await page.waitForSelector('li[title="Product Story"]', {timeout: 1000});
		await story.click();
		story_body = await page.$eval('div[class*="component-wrapper"]', el => el.innerHTML);
	} catch (e) {
		console.log('no story_body');
	}


	// Complete the look
	let ctl = await page.$$('div[class*="complete_the_look_container"] div[class*="card_container"]');
	for(let c of ctl){
		await c.click();
		let l = await page.$eval('div[class*="complete_the_look_container"] a', el => el.getAttribute('href'));
		let subUrls = l.split('/');
		let toProductId = subUrls[subUrls.length-1].split('.')[0];
		let insertArr = [id, toProductId];

		connection.query('insert into completeTheLook value (?, ?)', insertArr);

		let url = BASE_URL + l;
		if(!hashmap.has(toProductId))
			queue.push(url);
	}

	// You May Also Link
	let ymal = await page.$$eval('div[data-auto-id*="recommendations-carousel"] div.gl-product-card__details a', imgs => {return imgs.map(img => img.href)});
	ymal.forEach( y => {
		let l = y.split('?')[0];

		let subUrls = l.split('/');
		let toProductId = subUrls[subUrls.length-1].split('.')[0];
		let insertArr = [id, toProductId, 'ymal'];

		connection.query('insert into relatedProducts value (?, ?, ?)', insertArr);

		if(!hashmap.has(toProductId))
			queue.push(l);
	})

	let newProduct = [id, name, price, picture, highlights_body, description_body, specification_body, story_body]
	await connection.query('insert into products values (?, ?, ?, ?, ?, ?, ?, ?)', newProduct);
	await counter++;
}

start();