import { useState } from 'react';

function SearchBox({ onSubmit }) {
	const [inputValue, setInputValue] = useState('');

	const handleInputChange = (event) => {
		setInputValue(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		onSubmit(inputValue);
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
		</div>
	);
}

export default SearchBox;
