import mongoose, { Schema } from "mongoose";



const itemSchema = new Schema(
    {
       

    },
    { timestamps: true, }
);


export default mongoose.model('itemModel', itemSchema)