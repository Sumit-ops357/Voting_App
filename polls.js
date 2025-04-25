const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');

// Get means :-  Client wants to retrieve data from the backend

router.get('/', async(req,res) => {
    try{
        const polls = await Poll.find().sort({  // Retirve most recent polls from the database 
             created: -1
        });
        res.json(polls);
    }
    catch(error){
        res.status(500).json({
            message: error.message
        });
    }
});

// Create a new poll
router.post('/', async(req,res) => {
    const poll = new Poll({
        question: req.body.question,
        options: req.body.options
    });

    try{
        const newPoll = await poll.save();
        res.status(201).json(newPoll);
    }
    catch(error){
        res.status(400).json.json({
            message: error.message
        });
    }
});

//400 :- Client side error
//500 :- Server side error
//201 :- No error..Successfully sent

// Vote on a poll
router.post('/:id/vote', async(req,res) => {
    try{
        const poll = await Poll.findById(req.params.id);

        if(!poll){
            return res.status(404).json({
                message: 'Poll not found'
            });
        }

        const option = poll.options.id(req.body.optionId);

        if(!option){
            return res.status(404).json({
                message: 'Option not found'
            });
        }

        option.votes +=1;
        await poll.save();
        res.json(poll);
    }
    catch(error)
    {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get a specific poll by Id
router.get('/:id', async(req,res) => {
    try{
        const poll = await Poll.findById(req.params.id);

        if(!poll){
            return res.status(404).json({
                message: 'Poll not found'
            });
        }
        res.json(poll);
    }
    catch(error)
    {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;