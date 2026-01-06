const express = require('express');
const cors = require('cors');
const cityRoutes = require('./routes/cityRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = 5555;

app.set('trust proxy', true);
app.use(cors());
app.use(express.json());

app.use('/api/cities', cityRoutes);
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});