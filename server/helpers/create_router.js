const express = require('express');
/* NB. this isn't ObjectID as I accidentally updated to the new mongodb driver */
const { ObjectId } = require('mongodb');

const handleError = (err) => {
    console.error(err);
    res.status(500);
    res.json({ status: 500, error: err });
}

const createRouter = function (collection) {
    /* Setup CRUD routes */
    const router = express.Router();

    /* INDEX */
    router.get('/', (req, res) => {
        collection
            .find()
            .toArray()
            .then((docs) => res.json(docs))
            .catch(handleError);
    });

    /* SHOW */
    router.get('/:id', (req, res) => {
        const id = req.params.id;
        collection
            .findOne({ _id: ObjectId(id) })
            .then((doc) => res.json(doc))
            .catch(handleError);
    });

    /* CREATE */
    /* Again, due to accidentally updating mongodb this is different */
    /* The return from insertOne basically just contains `insertedId` */
    /* The documentation seems to imply that the id needs to be generated on the client-side anyway?! */
    router.post('/', (req, res) => {
        const newObject = req.body;
        collection
            .insertOne(newObject)
            .then(({insertedId}) => {
                /* two approaches here: just stuff the id into newObject, or do a fetch: maybe a redirect to the SHOW route?  Maybe a 201 with a Location header? */
                console.log("created", insertedId);
                // res.json({...newObject, _id: insertedId});
                return collection.findOne({ _id: insertedId })
            })
            .then((doc) => res.json(doc))
            .catch(handleError);
    });

    /* UPDATE */
    router.put('/:id', (req, res) => {
        const objId = new ObjectId(req.params.id);
        const updatedObject = req.body;
        collection
            .updateOne(
                { _id: objId },
                { $set: updatedObject }
            )
            .then(result => res.json(result))
            .catch(handleError)
    });

    /* DESTROY */
    router.delete('/:id', (req, res) => {
        const objId = new ObjectId(req.params.id);
        collection
            .deleteOne({ _id: objId })
            .then(result => {
                console.log(result);
                res.json(result)
            })
            .catch(handleError)
    });

    return router;
};

module.exports = createRouter;
