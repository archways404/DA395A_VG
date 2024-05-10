import { useState, useEffect } from 'react';
import SearchBox from './SearchBox.jsx';
import SearchResults from './components/searchResults.jsx';
import StreamFreeSeasons from './components/StreamFreeSeasons.jsx';

function Router() {
	const [display, setDisplay] = useState('searchBox');
	const [data, setData] = useState(null);
	const [seasonData, setSeasonData] = useState(null);

	const handleSearch = (searchTerm) => {
		fetch('http://localhost:3000/testendpoint', {
			//fetch('http://localhost:3000/endpoint', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ searchTerm }),
		})
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				console.log('Success:', data);
				if (data) setDisplay('searchResults');
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const handleSelectFreeStream = (seasonData) => {
		setSeasonData(seasonData);
		setDisplay('StreamFreeSeasons');
	};

	return (
		<div className="app-container">
			<SearchBox onSubmit={handleSearch} />
			{display === 'searchResults' && data && (
				<SearchResults
					data={data}
					onSelectFreeStream={handleSelectFreeStream}
				/>
			)}
			{display === 'StreamFreeSeasons' && (
				<StreamFreeSeasons
					seasonData={seasonData}
					onBack={() => setDisplay('searchResults')}
				/>
			)}
		</div>
	);
}

export default Router;
