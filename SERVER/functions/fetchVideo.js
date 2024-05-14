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

module.exports = { fetchEpisodes, fetchEpisodeVideoLink };
