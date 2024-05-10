const puppeteer = require('puppeteer');

async function fetchEpisodes(link) {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(link, { waitUntil: 'networkidle2' });
	await page.click('a#play-now');
	await page.waitForSelector('#eps-list');
	const episodes = await page.evaluate(() => {
		const episodeButtons = Array.from(
			document.querySelectorAll('#eps-list button')
		);
		return episodeButtons.map((button) => ({
			title: button.title,
		}));
	});
	await browser.close();
	return episodes;
}

async function fetchEpisodeVideoLink(link, episode_id) {
	// false for debugging -> Works in headless mode but not in non-headless mode
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	await page.goto(link, { waitUntil: 'networkidle2' });
	if (await page.$('a#play-now')) {
		await page.click('a#play-now');
	}
	async function processTabs() {
		const pages = await browser.pages();
		for (const tab of pages) {
			await tab.bringToFront();
			try {
				if (await page.$('a#play-now')) {
					await page.click('a#play-now');
				}

				const videoSrc = await page.evaluate(async (episode_id) => {
					const episodeButton = document.querySelector(
						`button[title="${episode_id}"]`
					);
					if (episodeButton) {
						episodeButton.disabled = false;
						episodeButton.click();
					}
					await new Promise((resolve) => setTimeout(resolve, 5000));
					const iframe = document.querySelector('iframe#playit');
					return iframe ? iframe.src : null;
				}, episode_id);
				const otherPages = (await browser.pages()).filter((p) => p !== tab);
				await Promise.all(otherPages.map((p) => p.close()));
				return videoSrc;
			} catch (error) {
				console.log(`Tab handling error: ${error.message}`);
				if (tab.url() !== link) {
					await tab.close();
				}
			}
		}
		return null;
	}
	let result;
	do {
		result = await processTabs();
	} while (!result && (await browser.pages()).length > 1);

	await browser.close();
	return result;
}

/*
async function fetchEpisodeVideoLink(link, episode_id) {
	const browser = await puppeteer.launch({ headless: false }); // Run in non-headless mode to see the browser
	const page = await browser.newPage();

	// Navigate to the page
	await page.goto(link, { waitUntil: 'networkidle2' });

	// Attempt to click the 'play-now' button if exists
	if (await page.$('a#play-now')) {
		await page.click('a#play-now');
	}

	// Define a function to handle tabs and attempt to find the episode
	async function processTabs() {
		const pages = await browser.pages();
		for (const tab of pages) {
			await tab.bringToFront();
			try {
				if (await page.$('a#play-now')) {
					await page.click('a#play-now');
				}
				const titles = await tab.evaluate(() =>
					Array.from(
						document.querySelectorAll('#eps-list button'),
						(btn) => btn.title
					)
				);
				console.log(titles);

				const buttons = await tab.evaluate(() =>
					Array.from(document.querySelectorAll('#eps-list button'), (btn) => ({
						title: btn.title,
						outerHTML: btn.outerHTML,
					}))
				);
				console.log(buttons);

				await tab.evaluate((episode_id) => {
					const episodeButton = document.querySelector(
						`button[title="${episode_id}"]`
					);
					if (episodeButton) {
						episodeButton.scrollIntoView({
							behavior: 'smooth',
							block: 'center',
						});
						episodeButton.click(); // Use direct click from JavaScript
					}
				}, episode_id);

				// Click the episode button
				await tab.click(`button[title="${episode_id}"]`);
				// Wait for the iframe to appear and extract the video source

				await tab.waitForSelector('iframe#playit', {
					visible: true,
					timeout: 10000,
				});
				const videoSrc = await tab.evaluate(() => {
					const iframe = document.querySelector('iframe#playit');
					return iframe ? iframe.src : null;
				});

				// Close other tabs if any
				const otherPages = (await browser.pages()).filter((p) => p !== tab);
				await Promise.all(otherPages.map((p) => p.close()));

				return videoSrc; // Return the video source if successful
			} catch (error) {
				console.log(`Tab handling error: ${error.message}`);
				// Close the tab if it doesn't contain the expected elements
				if (tab.url() !== link) {
					await tab.close();
				}
			}
		}
		return null;
	}

	// Continuously process tabs until the correct content is found or no more tabs are left
	let result;
	do {
		result = await processTabs();
	} while (!result && (await browser.pages()).length > 1);

	await browser.close();
	return result;
}
*/

module.exports = { fetchEpisodes, fetchEpisodeVideoLink };
