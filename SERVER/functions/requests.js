async function getStreamingData(searchTerm, userLocation, apiKEY, apiHOST) {
	const url = `https://streaming-availability.p.rapidapi.com/search/title?country=${userLocation}&title=${searchTerm}&output_language=en&show_type=all`;

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
		const filteredData = result.result.find((item) =>
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
			return responseData;
		} else {
			return { error: 'No data found for the given search term' };
		}
	} catch (error) {
		console.error(error);
		return { error: 'An error occurred during data processing' };
	}
}

async function getTestData(exampleData, searchTerm) {
	// Check if searchTerm is defined and a non-empty string
	if (!searchTerm || typeof searchTerm !== 'string') {
		return { error: 'Invalid or missing search term' };
	}
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
			return responseData;
		} else {
			return { error: 'No data found for the given search term' };
		}
	} catch (error) {
		console.error(error);
		return { error: 'An error occurred during data processing' };
	}
}

async function get123MoviesData(searchTerm) {
	try {
		const response = await fetch(
			`https://ww3.123moviesfree.net/searching?q=${searchTerm}&limit=40&offset=0`,
			{
				method: 'GET',
			}
		);
		const result = await response.json();

		console.log(result);
		return result;
	} catch (error) {
		console.error(error);
		return error;
	}
}

async function integrate123Movies(searchTerm) {
	const result = await get123MoviesData(searchTerm);
	if (result && result.data) {
		const serviceData = {
			service: '123movies',
			streamingType: 'free',
			seasons: result.data.map((season) => ({
				title: season.t,
				slug: season.s,
				episodes: season.e,
				quality: season.q,
				year: season.y,
				link: `https://ww3.123moviesfree.net/season/${season.s}`,
			})),
		};
		return serviceData;
	} else {
		return { error: 'No data found or an error occurred' };
	}
}

async function getAllStreamingData(searchTerm) {
	const existingServices = await getStreamingData(
		searchTerm,
		userLocation,
		apiKEY,
		apiHOST
	);
	const movies123Service = await integrate123Movies(searchTerm);

	if (!movies123Service.error) {
		existingServices.services.push(movies123Service);
	}

	return existingServices;
}

module.exports = {
	getStreamingData,
	getTestData,
	get123MoviesData,
	integrate123Movies,
	getAllStreamingData,
};