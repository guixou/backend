const Thing = require('../models/thing');
const fs = require('fs');

//ajouter des donnée textuel
// exports.createThing = (req, res, next) => {
//     delete req.body._id;
//     const thing = new Thing({
//         ...req.body
//     });
//     thing.save()
//         .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
//         .catch(error => res.status(400).json({ error }));
// }

// ajouter des donnée textuel et image
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
  
    thing.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
};
 
// modification simple sans image
// exports.modifyThing = (req, res, next) => {
//     Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
//     .then(() => res.status(200).json({ message: 'object modifié'}))
//     .catch(error => res.status(400).json({ error }));
// }

// modificaiton d'image
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete thingObject._userId;
    Thing.findOne({_id: req.params.id})
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Thing.updateOne({ _id: req.params.id}, { ...thingObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

//suppression ismple sans image
// exports.deleteThing = (req, res, next) => {
//     Thing.deleteOne({ _id: req.params.id })
//     .then(things => res.status(200).json({ message: 'oject supprimé' }))
//     .catch(error => res.status(404).json({ error }));
// }

// suppresion avec image
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id})
        .then(thing => {
            if (thing.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = thing.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Thing.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

exports.getOnThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
}

exports.getAllThing = (req, res, next) => {
    Thing.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
}