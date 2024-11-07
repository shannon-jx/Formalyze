const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const groqRoutes = require('./routes/groq');

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(express.json());
app.use('/api', groqRoutes);

app.get('/', (req, res) => {
    res.send('Server backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});