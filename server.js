const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const envelopes = require('./envelopes');

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// SAVE ID PARAMETER

app.param('id', (req, res, next, id) => {
    const envelopeId = Number(id);
    if (isNaN(envelopeId)) {
        res.status(400).send('Invalid ID');
    } else {
        req.envelopeId = envelopeId;
        next(); 
    }
});

// GET ALL ENVELOPES

app.get('/', (req, res, next) => {
    res.status(200).send(envelopes);
});

// GET ENVELOPE BY ID

app.get('/envelopes/:id', (req, res, next) => {
    const envelope = envelopes.find(env => env.id === req.envelopeId);
    if (envelope) {
        res.status(200).send(envelope);
    } else {
        res.status(404).send('Envelope Not Found')
    }
    
}) 

// CREATE ENVELOPE

app.post('/envelopes', (req, res, next) => {
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

app.put('/envelopes/:id', (req, res, next) => {
    const envelope = envelopes.find(env => env.id === req.envelopeId);
    const { category, budget, spend } = req.body;

    if (envelope) {
        
        if(category && typeof category === 'string') {
            envelope.category = category;
        }
        
        if(!isNaN(budget) && budget >= 0) {
            envelope.budget = budget;
        }

        if(!isNaN(spend) && spend >= 0) {
            envelope.budget -= spend; 
        }
    
        res.status(200).send(envelope); 

    } else {
        res.status(404).send('Envelope Not Found')
    }
})

// DELETE ROUTES

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});