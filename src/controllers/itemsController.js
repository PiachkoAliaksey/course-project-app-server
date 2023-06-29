import collectionModel from "../collectionModel.js";
import itemsModel from "../itemsModel.js";
import itemModel from "../itemsModel.js";
import userModel from "../userModel.js";



export const createCollection = async (req, res) => {
    try {
        const doc = new collectionModel({
            title: req.body.title,
            description: req.body.description,
            theme: req.body.theme,
            user: req.userId,
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
            usersLike: [],
            user: req.userId,
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
        let doc = await itemModel.find({ collectionName: collectionId });
        res.json(doc);
    } catch (err) {
        res.status(500).json({
            message: 'wrong access'
        })
    }
}

export const deleteOneItem = async (req, res) => {
    try {
        //const collection = await collectionModel.findOneAndUpdate({_id:req.body.collectionName},{$inc: {countOfItems: 1}},{new: true});
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
        console.log(doc);
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

export const getItemTags = async (req, res) => {
    try {
        const allItem = await itemModel.find({}).exec();
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
        const allCollection = await collectionModel.find().sort({ countOfItems: -1 }).limit(5).exec();
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
            const item = await itemModel.findOne({_id: itemId});
            const{usersLike,...itemData} = item;
            console.log(usersLike)
            const arrayOfLikes = [...usersLike,idUser];
            console.log(arrayOfLikes)
            let doc = await itemModel.updateOne({ _id: itemId }, {
                usersLike:arrayOfLikes
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
            const {usersLike,...itemData} = await itemModel.findOne({_id: itemId});
            const arrayOfLikes = usersLike.filter(user=>user!==idUser);
            let doc = await itemModel.updateOne({ _id: itemId }, {
                usersLike:arrayOfLikes,
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
        const itemLikes = await itemModel.findOne({_id: itemId});
        console.log(itemLikes);
        const likes = itemLikes.usersLike;
        console.log(likes);
        res.json(likes);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'wrong all'
        })
    }
}
