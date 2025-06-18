const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const envelopes = require('./envelopes');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// GET ROUTES

app.get('/', (req, res, next) => {
    res.send('hello world')
})

// POST ROUTES

app.post('/envelopes', (req, res, next) => {
    const { category, budget } = req.body;
    const numericBudget = Number(budget);

    if (typeof category === 'string' && !isNaN(numericBudget)) {
        const maxId = envelopes.reduce((max, env) => Math.max(max, env.id), 0);
        const newEnvelope = {
            id: maxId + 1,
            category,
            budget: numericBudget
        };

        envelopes.push(newEnvelope);
        res.status(201).send(newEnvelope);
    } else {
        res.status(400).send('Invalid request body');
    }
});


// PUT ROUTES

// DELETE ROUTES

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});