import mongoose, { Schema } from "mongoose";



const CollectionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    theme: { type: String, required: true },
    customFields: { type: Array, default: [] },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    countOfItems: {
        type: Number,
        default: 0,
    }
}
    , { timestamps: true, });


export default mongoose.model('CollectionModel', CollectionSchema)