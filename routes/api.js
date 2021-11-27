const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');


// GET FULL DOCUMENT
router.get('/:id', async (req, res) => {
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id});
        res.send(result);
    } catch (e) {
        console.error(e);
    }
});

// GET ALL PURCHASES OBJECTS
router.get('/:id/purchases', async (req, res) => {
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id});
        res.send(result.purchases);
    } catch (e) {
        console.error(e);
    }
});

//UPDATE PURCHASES OBJECT WITH NEW PURCHASE
router.put('/:id/add/:store/:date', async (req, res) => {
    const id = uniqid()
    try {
        const current = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id})
        const newDoc = {
            ...current,
            purchases: {
                ...current.purchases,
                [id]: {
                    "store": req.params.store,
                    "date": req.params.date
                  }
            }
        }
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: newDoc});
        res.send(result);
    } catch (e) {
        console.error(e);
    }
});

router.delete ('/:id/delete/:purchaseId', async (req, res) => {
    try {
        const current = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id})
        const newDoc = {...current};
        
        delete newDoc.purchases[req.params.purchaseId];

        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: newDoc});
        res.send(result);
    } catch (e) {
        console.error(e);
    }
});

module.exports = router;