const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

//? INIT DOTENV AND LOAD VALUES INTO VARIABLES
dotenv.config();
const apiKey = process.env.API_KEY;

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

// Start the server
app.listen(PORT, async () => {
	console.log(`Server listening on port ${PORT}`);
});
