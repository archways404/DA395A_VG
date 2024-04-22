const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

//? IMPORTING THE EXAMPLE_SEARCH.JSON FILE
const exampleData = require('./example_search.json');

//? IMPORTING THE REQUEST FUNCTIONS FROM THE REQUESTS.JS FILE
const {
	getStreamingData,
	getTestData,
	get123MoviesData,
} = require('./functions/requests');

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
	//const userLocation = req.body.userLocation;
	const userLocation = 'se';

	try {
		const data = await getStreamingData(
			searchTerm,
			userLocation,
			apiKEY,
			apiHOST
		);
		res.json(data);
	} catch (error) {
		console.error(error);
	}
});

app.post('/testendpoint', async (req, res) => {
	const searchTerm = req.body.searchTerm;
	const userLocation = 'se'; // Not used in getTestData but kept for structure

	try {
		const data = await getTestData(exampleData, searchTerm);
		console.log(data); // Log to verify data structure
		res.json(data); // Send the actual data
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


app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
});
