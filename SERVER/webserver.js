const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

/*
  * [ TODO ]
  * BREAK DOWN THE LOGIC INTO FUNCTIONS
  * IMPLEMENT THE 123MOVIES DATA FETCHING & PARSING LOGIC
*/

//? IMPORTING THE EXAMPLE_SEARCH.JSON FILE
const exampleData = require('./example_search.json');

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

	/*
	 * COMMENTED OUT FOR TESTING PURPOSES
	 * THE API ONLY ALLOWS FOR 100 REQUESTS PER DAY
   * 
	// const userLocation = req.body.userLocation;
	//! ONLY FOR TESTING
	const userLocation = 'se';
	console.log('searchTerm:', searchTerm);

	const url = `https://streaming-availability.p.rapidapi.com/search/title?country=se&title=${searchTerm}&output_language=en&show_type=all`;

	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': apiKEY,
			'X-RapidAPI-Host': apiHOST,
		},
	};

	try {
		const response = await fetch(url, options);
		const result = await response.json();

		console.log(result);
	} catch (error) {
		console.error(error);
	}
	res.json({ searchTerm });
  */

	try {
		const filteredData = exampleData.result.find((item) =>
			item.title.toLowerCase().includes(searchTerm.toLowerCase())
		);

		if (filteredData) {
			const services = filteredData.streamingInfo.se.map((service) => ({
				service: service.service,
				streamingType: service.streamingType,
				link: service.link,
				videoLink: service.videoLink,
			}));

			const responseData = {
				originalTitle: filteredData.originalTitle,
				services: services,
			};
			console.log('Services and Types:', JSON.stringify(services, null, 2));
			console.log('responseData:', JSON.stringify(responseData, null, 2));

			/*
			//! TEMP FETCHING DATA FROM 123MOVIES
			try {
				const response = await fetch(
					'https://ww3.123moviesfree.net/searching?q=star wars&limit=40&offset=0',
					{
						method: 'GET',
					}
				);
				const result = await response.json();

				console.log(result);
			} catch (error) {
				console.error(error);
			}
      */

			res.json(responseData);
		} else {
			res.status(404).send('No data found for the given search term');
		}
	} catch (error) {
		console.error(error);
		res.status(500).send('Error processing request');
	}
});

app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
});
