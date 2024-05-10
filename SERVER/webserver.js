const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

//? IMPORTING THE EXAMPLE_SEARCH.JSON FILE
const exampleData = require('./example_search.json');
const unavailableExampleData = require('./example_search_the_wire.json');

//? IMPORTING THE REQUEST FUNCTIONS FROM THE REQUESTS.JS FILE
const {
	getStreamingData,
	getTestData,
	get123MoviesData,
	integrate123Movies,
	getAllStreamingData,
} = require('./functions/requests');

const {
	fetchEpisodes,
	fetchEpisodeVideoLink,
} = require('./functions/fetchVideo');

//? INIT DOTENV AND LOAD VALUES INTO VARIABLES
dotenv.config();
const apiKEY = process.env.API_KEY;
const apiHOST = process.env.API_HOST;

// TESTING TO VERIFY THAT THE ENV VARIABLES ARE LOADED
console.log('apiKEY:', apiKEY);
console.log('apiHOST:', apiHOST);

//? INIT EXPRESS AND SET PORT
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(
	cors({
		origin: '*',
	})
);

// ROUTES
app.get('/', async (req, res) => {
	res.send('Hello World!');
});

app.post('/endpoint', async (req, res) => {
	const searchTerm = req.body.searchTerm;
	const userLocation = 'se';
	try {
		const data = await getStreamingData(
			searchTerm,
			userLocation,
			apiKEY,
			apiHOST
		);

		const movies123Data = await get123MoviesData(searchTerm);
		if (movies123Data && movies123Data.data) {
			data.services.push({
				service: '123movies',
				streamingType: 'free',
				seasons: movies123Data.data.map((season) => ({
					title: season.t,
					episodes: season.e,
					quality: season.q,
					year: season.y,
					link: `https://ww3.123moviesfree.net/season/${season.s}`,
				})),
			});
		}

		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error processing request');
	}
});

app.post('/testendpoint', async (req, res) => {
	const searchTerm = req.body.searchTerm;
	const userLocation = 'se';
	try {
		const data = await getTestData(exampleData, searchTerm);
		const movies123Data = await get123MoviesData(searchTerm);
		if (movies123Data && movies123Data.data) {
			data.services.push({
				service: '123movies',
				streamingType: 'free',
				seasons: movies123Data.data.map((season) => ({
					title: season.t,
					episodes: season.e,
					quality: season.q,
					year: season.y,
					link: `https://ww3.123moviesfree.net/season/${season.s}`,
				})),
			});
		}
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error processing request');
	}
});

app.post('/test123', async (req, res) => {
	const searchTerm = req.body.searchTerm;
	try {
		const data = await get123MoviesData(searchTerm);
		console.log(data);
		res.json(data);
	} catch (error) {
		console.error(error);
		res.status(500).send('Server error processing request');
	}
});

app.post('/testing', async (req, res) => {
	const link = req.body.videoLink;
	console.log(link);
	const episodes = await fetchEpisodes(link);
	console.log(episodes);
	const episodeLinks = await fetchEpisodeVideoLink(link, 'Episode 7');
	console.log(episodeLinks);
	res.json(episodeLinks);
});


app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
});
