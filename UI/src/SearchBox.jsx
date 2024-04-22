import { useState } from 'react';

function SearchBox() {
	const [inputValue, setInputValue] = useState('');
	const [data, setData] = useState(null); // State to store the fetched data

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		fetch('http://localhost:3000/endpoint', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ searchTerm: inputValue }),
		})
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				console.log('Success:', data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<div className="max-w-md mx-auto mt-10">
			<form
				onSubmit={handleSubmit}
				className="flex items-center border-b border-teal-500 py-2">
				<input
					className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
					type="text"
					placeholder="Search..."
					aria-label="Search"
					value={inputValue}
					onChange={handleInputChange}
				/>
				<button
					className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
					type="submit">
					Search
				</button>
			</form>
			{data && (
				<div className="mt-4">
					<h3 className="text-lg font-bold">
						Results for: {data.originalTitle}
					</h3>
					<ul className="list-disc pl-5">
						{data.services.map((service, index) => (
							<li
								key={index}
								className="mt-2">
								<strong>Service:</strong> {service.service} (
								{service.streamingType})
								<br />
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
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default SearchBox;
