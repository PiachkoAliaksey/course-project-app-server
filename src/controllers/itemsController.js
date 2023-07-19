import { ObjectId } from "mongodb";
import collectionModel from "../collectionModel.js";
import itemsModel from "../itemsModel.js";
import itemModel from "../itemsModel.js";
import userModel from "../userModel.js";
import commentModel from "../commentModel.js";



export const createCollection = async (req, res) => {
    try {
        const doc = new collectionModel({
            title: req.body.title,
            description: req.body.description,
            theme: req.body.theme,
            user: new ObjectId(req.body.idUser),
        })
        const collection = await doc.save();
        res.json(collection);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong'
        })
    }
}

export const createCollectionWithCustomField = async (req, res) => {
    try {
        const doc = new collectionModel({
            title: req.body.title,
            description: req.body.description,
            theme: req.body.theme,
            customFields: req.body.customFields,
            user: new ObjectId(req.body.idUser),
        })
        const collection = await doc.save();
        res.json(collection);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong'
        })
    }
}

export const getAllCollections = async (req, res) => {
    try {
        const userId = req.params.id;
        let doc = await collectionModel.find({ user: userId });
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong access'
        })
    }
}

export const deleteOneCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        let docCollection = await collectionModel.findOneAndDelete({ _id: collectionId });
        let docCollectionItems = await itemModel.deleteMany({ collectionName: collectionId });
        if (!docCollection) {
            return res.status(404).json({
                message: 'collection not found'
            })
        }
        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })
    }
}

export const updateOneCollection = async (req, res) => {
    try {
        const postId = req.params.id;
        let doc = await collectionModel.updateOne({ _id: postId }, {
            title: req.body.title,
            description: req.body.description,
            theme: req.body.theme,
            user: req.userId,
        });
        if (!doc) {
            return res.status(404).json({
                message: 'post not found'
            })
        }
        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong'
        })

    }
}

export const updateOneCollectionCountItems = async (req, res) => {
    try {
        const collectionId = req.params.id;
        const collection = await collectionModel.findOneAndUpdate({ _id: collectionId }, { $inc: { countOfItems: -1 } }, { new: true });

        if (!collection) {
            return res.status(404).json({
                message: 'post not found'
            })
        }
        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong'
        })

    }
}

export const createItemCollection = async (req, res) => {
    try {
        const collection = await collectionModel.findOneAndUpdate({ _id: req.body.collectionName }, { $inc: { countOfItems: 1 } }, { new: true });

        const doc = new itemModel({
            title: req.body.title,
            tags: req.body.tags,
            collectionName: req.body.collectionName,
            customFields: req.body.customFields ? req.body.customFields : [],
            usersLike: [],
            user: new ObjectId(req.body.idUser),
        })
        const item = await doc.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({
            message: 'wrong'
        })
    }
}
export const getAllCollectionItems = async (req, res) => {
    try {
        const collectionId = req.params.id;
        let items = await itemModel.find({ collectionName: collectionId });
        res.json(items);
    } catch (err) {
        res.status(500).json({
            message: 'wrong access'
        })
    }
}
export const getCustomFieldsCollection = async (req, res) => {
    try {
        const collectionId = req.params.id;
        let collectionCustomFields = await collectionModel.findOne({ _id: collectionId }, { customFields: 1 })
        res.json(collectionCustomFields.customFields);
    } catch (err) {
        res.status(500).json({
            message: 'wrong access'
        })
    }
}

export const deleteOneItem = async (req, res) => {
    try {
        const collection = await collectionModel.findOneAndUpdate({ _id: req.body.collectionName }, { $inc: { countOfItems: -1 } }, { new: true });
        const itemId = req.params.id;
        let docItem = await itemModel.findOneAndDelete({ _id: itemId });
        if (!docItem) {
            return res.status(404).json({
                message: 'collection not found'
            })
        }
        res.json({
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })
    }
}

export const updateOneItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        let doc = await itemModel.updateOne({ _id: itemId }, {
            title: req.body.title,
            tags: req.body.tags,
            collectionName: req.body.collectionName,
            user: req.userId,
        });
        if (!doc) {
            return res.status(404).json({
                message: 'collection not found'
            })
        }
        res.json({
            success: true
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong'
        })

    }
}

export const getOneItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        let doc = await itemModel.findOne({ _id: itemId });
        res.json(doc);
    } catch (err) {
        res.status(500).json({
            message: 'wrong all'
        })
    }
}

export const getLastItems = async (req, res) => {
    try {
        const lastItems = await itemModel.find().sort({ _id: -1 }).limit(5).exec();
        const collectionFind = lastItems.map((obj) => obj.collectionName);
        const usersFind = lastItems.map((obj) => obj.user.toString());
        const users = await userModel.find({ _id: { $in: usersFind } });
        const collection = await collectionModel.find({ _id: { $in: collectionFind } });
        const newItemLastFive = lastItems.map((obj) => {
            let currentObj = {};
            collection.forEach((val, i) => {
                if (obj._doc.collectionName === val._id.toString()) {
                    currentObj = { ...obj._doc, 'collectionName': val.title }
                }
            })
            return currentObj
        })
        const newItemLasts = newItemLastFive.map((obj, i) => {
            let currentObj = {};
            users.forEach((val) => {
                if (obj.user.toString() === val._id.toString()) {
                    currentObj = { ...obj, 'user': val.fullName }
                }
            })
            return currentObj
        })

        res.json(newItemLasts);
    } catch (err) {
        res.status(500).json({
            message: 'wrong all'
        })
    }
}

export const getCloudTags = async (req, res) => {
    try {
        const allItem = await itemModel.find().exec();
        const tags = allItem.map(obj => obj.tags).flat();
        res.json([... new Set(tags)]);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong all'
        })
    }
}


export const getFiveLargestCollection = async (req, res) => {
    try {
        const allCollection = await collectionModel.aggregate([
            { $sort: { countOfItems: -1 } }
        ]).limit(5);

        if (!allCollection) {
            return res.status(404).json({
                message: 'collection not found'
            })
        }
        res.json(allCollection);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong all'
        })
    }
}

export const addUserLike = async (req, res) => {
    try {
        const itemId = req.params.id;
        const { idUser, isLiked } = req.body;
        if (!isLiked) {
            const item = await itemModel.findOne({ _id: itemId });
            const { usersLike, ...itemData } = item;
            const arrayOfLikes = [...usersLike, idUser];
            let doc = await itemModel.updateOne({ _id: itemId }, {
                usersLike: arrayOfLikes
            });
            if (!doc) {
                return res.status(404).json({
                    message: 'collection not found'
                })
            }
            res.json({
                success: true
            });
        } else {
            const { usersLike, ...itemData } = await itemModel.findOne({ _id: itemId });
            const arrayOfLikes = usersLike.filter(user => user !== idUser);
            let doc = await itemModel.updateOne({ _id: itemId }, {
                usersLike: arrayOfLikes,
            });
            if (!doc) {
                return res.status(404).json({
                    message: 'collection not found'
                })
            }
            res.json({
                success: true
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong'
        })

    }
}

export const getLikesOfItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        const itemLikes = await itemModel.findOne({ _id: itemId });

        const likes = itemLikes.usersLike;

        res.json(likes);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong all'
        })
    }
}

export const getAllMatchItems = async (req, res) => {
    try {
        const tag = `#${req.params.tag}`;
        let items = await itemModel.aggregate([
            { $match: { tags: tag } }
        ])
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong access'
        })
    }
}

export const searchItems = async (req, res) => {
    try {
        let items;
        if (req.query.searchText) {
            items = await itemsModel.aggregate(
                [
                    {
                        '$search': {
                            "autocomplete": {
                                "query": `${req.query.searchText}`, "path": "title", "fuzzy": {
                                    "maxEdits": 2,
                                    "prefixLength": 3
                                }
                            }
                        }
                    }, {
                        '$limit': 5
                    }, {
                        '$project': {
                            '_id': 1,
                            'title': 1
                        }
                    }
                ]
            );
        } else {
            items = await itemsModel.find().sort({ createdAt: 'desc' });
        }
        res.json(items);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })

    }
}

export const searchItemsByComments = async (req, res) => {
    try {
        let items;
        if (req.query.searchText) {
            items = await commentModel.aggregate(
                [
                    {
                        '$search': {
                            'index': 'searchByComment',
                            'text': {
                                'query': `${req.query.searchText}`,
                                'path': 'message.text'
                            }
                        }
                    }
                ]
            );
        } else {
            items = await commentModel.find().sort({ createdAt: 'desc' });
        }

        const itemsByComment = await Promise.all(items.map(
            item => itemModel.find({
                _id: item.users[1]
            }, { _id: 1, title: 1 })
        ))
        res.json(itemsByComment.flat());
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })

    }
}

export const searchItemsByCollection = async (req, res) => {
    try {
        let collections = [];
        if (req.query.searchText) {
            collections = await collectionModel.aggregate(
                [
                    {
                        '$search': {
                            'index': 'searchByCollection',
                            'text': {
                                'query': `${req.query.searchText}`,
                                'path': 'title'
                            }
                        }
                    }
                ]
            );
        }

        const itemsByCollection = await Promise.all(collections.map(
            collection => itemModel.find({
                collectionName: collection._id
            }, { _id: 1, title: 1 }).sort({ _id: -1 }).limit(1)
        ))
        res.json(itemsByCollection.flat());
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong request'
        })

    }
}
