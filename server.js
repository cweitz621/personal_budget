const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const envelopes = require('./envelopes');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ATTACH ENVELOPE INFORMATION INTO THE REQUEST BODY

app.param('id', (req, res, next, id) => {
    const envelopeId = Number(id);

    if (isNaN(envelopeId)) {
        return res.status(400).send('Invalid ID');
    }

    const index = envelopes.findIndex(env => env.id === envelopeId);

    if (index === -1) {
        return res.status(404).send('Envelope not found');
    }

    req.envelopeId = envelopeId;
    req.index = index;
    req.envelope = envelopes[index];
    next();
});


// GET ALL ENVELOPES

app.get('/', (req, res) => {
    res.status(200).send(envelopes);
});

// GET ENVELOPE BY ID

app.get('/envelopes/:id', (req, res) => {
    if (req.envelope) {
        res.status(200).send(req.envelope);
    } else {
        res.status(404).send('Envelope Not Found')
    }
    
}) 

// CREATE ENVELOPE

app.post('/envelopes', (req, res) => {
    const { category, budget } = req.body;
    const numericBudget = Number(budget);

    if (typeof category === 'string' && !isNaN(numericBudget)) {
        const hasCategory = envelopes.some(env => env.category === category);
        if (!hasCategory) {
            const maxId = envelopes.reduce((max, env) => Math.max(max, env.id), 0);
            const newEnvelope = {
                id: maxId + 1,
                category,
                budget: numericBudget
        };
            envelopes.push(newEnvelope);
            res.status(201).send(newEnvelope);
        } else {
            res.status(400).send('Category already exists')
        }


    } else {
        res.status(400).send('Invalid request body');
    }
});

// UPDATE ENVELOPE 

app.put('/envelopes/:id', (req, res) => {
    const { category, budget, spend } = req.body;

    if (!req.envelope) {
        return res.status(404).send('Envelope Not Found');
    }

    if (typeof category === 'string' && category.trim() !== '') {
        req.envelope.category = category.trim();
    }

    if (!isNaN(budget) && Number(budget) >= 0) {
        req.envelope.budget = Number(budget);
    }

    if (!isNaN(spend) && Number(spend) >= 0) {
        const spendAmount = Number(spend);

        if (req.envelope.budget < spendAmount) {
            return res.status(400).send('Insufficient budget for spend');
        }

        req.envelope.budget -= spendAmount;
    }

    res.status(200).send(req.envelope);
});


// DELETE BY ID

app.delete('/envelopes/:id', (req, res) => {
    envelopes.splice(req.index, 1);
    res.status(204).send();
});

// SERVER INITIALIZATION

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});