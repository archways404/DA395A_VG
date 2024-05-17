import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

function SearchResults({ data, onSelectFreeStream }) {
	return (
		<div className="mt-8 mx-auto max-w-2xl p-4 bg-white shadow rounded">
			<h3 className="text-xl font-bold mb-4 text-center">
				Results for: {data.originalTitle}
			</h3>
			<ul className="list-disc pl-5">
				{data.services.map((service, index) => (
					<li
						key={index}
						className="mb-4">
						<div className="flex items-center mb-2">
							<strong className="mr-2">Service:</strong>
							{service.service === 'Apple TV' && (
								<FontAwesomeIcon
									icon={faApple}
									className="text-gray-800 mr-2"
								/>
							)}
							<span className="text-lg">{service.service}</span>
							<span className="text-sm text-gray-600 ml-1">
								({service.streamingType})
							</span>
						</div>
						<div className="ml-6">
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
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default SearchResults;
