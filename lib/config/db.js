import mongoose from "mongoose";

export const ConnectDB = async () =>{
    await mongoose.connect('mongodb+srv://mdgafru:gafru1234@cluster0.cnnrrr2.mongodb.net');
    console.log("DB Connected");
}