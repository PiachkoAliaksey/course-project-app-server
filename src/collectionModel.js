import mongoose,{Schema} from "mongoose";



const CollectionSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    theme:{type:String,required:true},
    custom3FieldOfInteger:Boolean,
    custom3FieldOfText:Boolean,
    custom3FieldOfLargeText:Boolean,
    custom3FieldOfCheckBox:Boolean,
    custom3FieldOfData:Boolean,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true,   
    },
    countOfItems:{
        type:Number,
        default:0,
    }
}
,{timestamps:true,});


export default mongoose.model('CollectionModel',CollectionSchema)