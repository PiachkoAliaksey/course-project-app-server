import mongoose, { Schema } from "mongoose";



const itemSchema = new Schema(
    {
        title: { type: String, required: true },
        tags: { type: Array, default: [] },
        collectionName:{ type: String, required: true },
        usersLike:{ type: Array, default: [] },
        custom3FieldOfInteger: Boolean,
        custom3FieldOfText: Boolean,
        custom3FieldOfLargeText: Boolean,
        custom3FieldOfCheckBox: Boolean,
        custom3FieldOfData: Boolean,
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'UserModel',
            required:true,   
        }
    },
    { timestamps: true, }
);


export default mongoose.model('itemModel', itemSchema)