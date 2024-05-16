/* eslint-disable react/prop-types */
import { useState } from 'react';

function StreamFreeSeasons({ seasonData, onBack }) {
	const [selectedSeason, setSelectedSeason] = useState(null);
	const [episodes, setEpisodes] = useState([]);
	const [videoLink, setVideoLink] = useState(null);

	const handleSeasonClick = (seasonLink) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ videoLink: seasonLink }),
		};

		fetch('http://localhost:3000/testing2', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				setSelectedSeason(seasonLink);
				setEpisodes(data);
				setVideoLink(null); // Clear any existing video link
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const handleEpisodeClick = (seasonLink, episodeTitle) => {
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				videoLink: seasonLink,
				selectedEpisode: episodeTitle,
			}),
		};

		fetch('http://localhost:3000/testing', requestOptions)
			.then((response) => response.json())
			.then((data) => {
				console.log('Success:', data);
				setVideoLink(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<div className="flex flex-col items-center mt-4 mx-auto">
			<div className="w-full flex justify-between items-start mb-4">
				<button
					onClick={onBack}
					className="text-blue-500 hover:underline pl-5 mb-2">
					Back to Search Results
				</button>
				<div className="flex flex-col items-end">
					<h2 className="text-xl pb-2">Available Seasons</h2>
					<div className="flex flex-col items-center gap-2">
						{seasonData.seasons.map((season, index) => {
							const seasonText = season.title.replace(/.*Season /, '');
							return (
								<button
									key={index}
									onClick={() => handleSeasonClick(season.link)}
									className={`py-2 px-4 rounded shadow text-sm w-auto ${
										selectedSeason === season.link
											? 'bg-green-700 hover:bg-green-900 text-white font-bold'
											: 'bg-green-500 hover:bg-green-700 text-white font-bold'
									}`}
									style={{ transition: 'all 0.3s ease' }}>
									Season {seasonText}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			<div className="w-full text-center">
				{videoLink ? (
					<iframe
						src={videoLink}
						width="800"
						height="450"
						frameBorder="0"
						allow="autoplay; fullscreen"
						allowFullScreen></iframe>
				) : (
					<div className="w-800 h-450 bg-gray-200 flex items-center justify-center">
						<p className="text-gray-500">Video player will appear here</p>
					</div>
				)}
			</div>

			{selectedSeason && episodes.length > 0 && (
				<div className="w-full text-center mt-4">
					<h2 className="text-xl pb-5">Episodes</h2>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{episodes.map((episode, episodeIndex) => (
							<button
								key={episodeIndex}
								onClick={() =>
									handleEpisodeClick(selectedSeason, episode.title)
								}
								className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded shadow text-sm"
								style={{ transition: 'all 0.3s ease' }}>
								{episode.title}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default StreamFreeSeasons;
