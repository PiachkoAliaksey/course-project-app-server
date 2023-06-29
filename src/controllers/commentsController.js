import commentModel from "../commentModel.js";
import userModel from "../userModel.js";

export const addComment = async (req, res, next) => {
    try {
        const { from, to, comment } = req.body;
        const data = await commentModel.create({
            message: { text: comment },
            users: [from, to],
            sender: from,
        });
        if (data) {
            res.json({ msg: "sent successfully" });
        } else {
            res.json({ msg: "Failed to add message to database" });
        }
    } catch (err) {
        next(err)
    }
}

export const getAllComments = async (req, res, next) => {
    try {
        const { to } = req.body;
        const items = await commentModel.find({
            users: {
                $all: [to]
            }
        }).sort({ updatedAt: 1 }).exec();
        const itemsSenderId = items.map((obj) => obj.sender.toString());
        const users = await userModel.find({ _id: { $in: itemsSenderId } });

        const commentsItem = await commentModel.find({
            users: {
                $all: [to]
            }
        }).sort({ updatedAt: 1 });
        const userComments = items.map((msg) => {
            let nameSender = '';
            users.forEach(user => {
                if (user._id.toString() === msg._doc.sender.toString()) {
                    nameSender = user.fullName
                }
            })
            return {
                from: nameSender,
                message: msg.message.text,
                created: `${msg.createdAt.toString().slice(16, 24)}, ${msg.createdAt.toString().slice(0, 15)}`
            }
        })
        res.json(userComments)
    } catch (err) {
        next(err)
    }
}