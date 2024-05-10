function StreamFreeSeasons({ seasonData, onBack }) {
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
								<button
									key={index}
									onClick={() => window.open(season.link, '_blank')}
									className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow text-sm w-auto"
									style={{ transition: 'all 0.3s ease' }}>
									Season {seasonText}
								</button>
							);
						})}
					</div>
				</div>
			) : (
				<p>No seasons available.</p>
			)}
		</div>
	);
}

export default StreamFreeSeasons;
