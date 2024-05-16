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
			<div className="self-start">
				<button
					onClick={onBack}
					className="text-blue-500 hover:underline pl-5 mb-2">
					Back to Search Results
				</button>
			</div>
			<h1 className="text-2xl font-bold pb-5">{seasonData.originalTitle}</h1>
			{seasonData ? (
				<div className="w-full text-center">
					<h2 className="text-xl pb-5">Available Seasons</h2>
					<div className="flex flex-col items-center gap-2">
						{seasonData.seasons.map((season, index) => {
							const seasonText = season.title.replace(/.*Season /, '');
							return (
								<div
									key={index}
									className="w-full">
									<button
										onClick={() => handleSeasonClick(season.link)}
										className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow text-sm w-auto"
										style={{ transition: 'all 0.3s ease' }}>
										Season {seasonText}
									</button>
									{selectedSeason === season.link && (
										<div className="mt-2 flex flex-col items-center gap-2">
											{episodes.map((episode, episodeIndex) => (
												<button
													key={episodeIndex}
													onClick={() =>
														handleEpisodeClick(season.link, episode.title)
													}
													className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded shadow text-sm w-auto"
													style={{ transition: 'all 0.3s ease' }}>
													{episode.title}
												</button>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
					{videoLink && (
						<iframe
							src={videoLink}
							width="800"
							height="450"
							frameBorder="0"
							allow="autoplay; fullscreen"
							allowFullScreen></iframe>
					)}
				</div>
			) : (
				<p>No seasons available.</p>
			)}
		</div>
	);
}

export default StreamFreeSeasons;
