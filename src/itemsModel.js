import mongoose, { Schema } from "mongoose";



const itemSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: Array, default: [] },
        collectionName: { type: String, required: true },
        customFields: { type: Array, default: [] },
        usersLike: { type: Array, default: [] },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    { timestamps: true, }
);


export default mongoose.model('itemModel', itemSchema)