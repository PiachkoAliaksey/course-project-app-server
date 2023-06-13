import mongoose,{Schema} from "mongoose";



const UserSchema = new Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    status:{type:String,required:true},
    position:{type:String,required:true}
}
,{timestamps:true,});


export default mongoose.model('UserModel',UserSchema)