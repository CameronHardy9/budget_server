const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');

router.get('/:id', async (req, res) => {
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id});
        res.send(result);
    } catch (e) {
        console.error(e);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: req.body});
        res.send(result);
    } catch (e) {
        console.error(e)
    }
})

module.exports = router;