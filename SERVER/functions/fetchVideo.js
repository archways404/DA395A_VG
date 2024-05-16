const puppeteer = require('puppeteer');

async function fetchEpisodes(link) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(link, { waitUntil: 'networkidle2' });

	async function clickPlayNowAndHandleTabs() {
		let playNowClicked = false;
		let retries = 5;

		while (retries > 0) {
			const pages = await browser.pages();
			for (const tab of pages) {
				await tab.bringToFront();
				try {
					if (await tab.$('a#play-now')) {
						await tab.click('a#play-now');
						playNowClicked = true;
					}
				} catch (error) {
					console.log(`Error clicking 'a#play-now': ${error.message}`);
				}

				const otherPages = (await browser.pages()).filter((p) => p !== page);
				await Promise.all(otherPages.map((p) => p.close()));
			}

			if (playNowClicked) {
				retries--;
			} else {
				break;
			}
		}
	}

	await clickPlayNowAndHandleTabs();

	// Increase the timeout period
	await page.waitForSelector('#eps-list', { timeout: 60000 });

	// Fetch episodes from the episode list
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

/*
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
*/

async function fetchEpisodeVideoLink(link, episode_id) {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();
	await page.goto(link, { waitUntil: 'networkidle2' });
	async function clickPlayNowAndHandleTabs() {
		let playNowClicked = false;
		let retries = 5;

		while (retries > 0) {
			const pages = await browser.pages();
			for (const tab of pages) {
				await tab.bringToFront();
				try {
					if (await tab.$('a#play-now')) {
						await tab.click('a#play-now');
						playNowClicked = true;
					}
				} catch (error) {
					console.log(`Error clicking 'a#play-now': ${error.message}`);
				}
				const otherPages = (await browser.pages()).filter((p) => p !== page);
				await Promise.all(otherPages.map((p) => p.close()));
			}

			if (playNowClicked) {
				retries--;
			} else {
				break;
			}
		}
	}

	await clickPlayNowAndHandleTabs();
	async function processTabs() {
		const pages = await browser.pages();
		for (const tab of pages) {
			await tab.bringToFront();
			try {
				const videoSrc = await tab.evaluate(async (episode_id) => {
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
