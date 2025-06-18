const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res, next) => {
    res.send('hello world')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});