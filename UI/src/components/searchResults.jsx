function SearchResults({ data, onSelectFreeStream }) {
	return (
		<div className="mt-4">
			<h3 className="text-lg font-bold">Results for: {data.originalTitle}</h3>
			<ul className="list-disc pl-5">
				{data.services.map((service, index) => (
					<li key={index}>
						<strong>Service:</strong> {service.service} ({service.streamingType}
						)
						<br />
						{service.service === '123movies' ? (
							<button
								onClick={() =>
									onSelectFreeStream({
										originalTitle: data.originalTitle,
										seasons: service.seasons,
									})
								}
								className="mt-2 text-blue-500 hover:underline">
								Watch on 123movies
							</button>
						) : (
							<>
								<a
									href={service.link}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-500 hover:underline">
									Watch on {service.service}
								</a>
								{service.videoLink && (
									<a
										href={service.videoLink}
										target="_blank"
										rel="noopener noreferrer"
										className="ml-4 text-blue-500 hover:underline">
										Direct Video Link
									</a>
								)}
							</>
						)}
					</li>
				))}
			</ul>
		</div>
	);
}

export default SearchResults;
