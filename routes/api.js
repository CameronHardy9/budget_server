const express = require('express');
const router = express.Router();
const uniqid = require('uniqid');

// ADD NEW USER
router.post('/:id', async(req, res) => {
    const newDoc = {
        _id: req.params.id,
        budget: 0,
        purchases: []
    }
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").insertOne(newDoc);
        res.send(result);
    } catch (e) {
        console.error(e);
    }
})

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

//UPDATE CURRENT BUDGET
router.put('/:id/budget/:amount', async (req, res) => {
    try {
        const current = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id})
        const newDoc = {
            ...current,
            budget: req.params.amount
        }
        await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: newDoc});
        res.send(newDoc);
    } catch (e) {
        console.error(e);
    }
});

//UPDATE SINGLE PURCHASE DATA
router.put('/:id/purchases', async (req,res) => {
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: req.body});
        res.send(result);
    } catch (e) {
        console.error(e);
    }
});

//UPDATE PURCHASES OBJECT WITH NEW PURCHASE
router.put('/:id/add/:store/:amount/:date', async (req, res) => {
    const id = uniqid()
    try {
        const current = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id})
        const newDoc = {
            ...current,
            purchases: [
                ...current.purchases,
                {
                    "uniqid": id,
                    "store": req.params.store,
                    "amount": parseFloat(req.params.amount),
                    "date": req.params.date
                }
            ]
        }
        await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: newDoc});
        res.send(newDoc);
    } catch (e) {
        console.error(e);
    }
});

//DELETE SELECTED PURCHASE
router.delete ('/:id/delete/:purchaseId', async (req, res) => {
    try {
        const current = await req.app.locals.client.db("Family_Budget_App").collection("Budget").findOne({"_id": req.params.id})
        const newDoc = {...current};
        
        newDoc.purchases.forEach((item, index) => {
            if (item.uniqid === req.params.purchaseId) {
                newDoc.purchases.splice(index, 1)
            }
        });

        await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: newDoc});
        res.send(newDoc);
    } catch (e) {
        console.error(e);
    }
});

//DELETE ALL PURCHASES
router.delete ('/:id/deleteAll', async (req, res) => {
    try {
        const result = await req.app.locals.client.db("Family_Budget_App").collection("Budget").updateOne({"_id": req.params.id}, {$set: {purchases: []}});
        res.send(result);
    } catch (e) {
        console.error(e);
    }
})

module.exports = router;
