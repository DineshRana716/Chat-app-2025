const asyncHandler=require("express-async-handler");
const Message=require("../Models/messageModel");
const User=require("../Models/userModel");
const Chat=require("../Models/chatModels");

const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body;
    if(!content || !chatId){
        console.log("invalid data passed into request");
        return res.status(400);
    }
    var newMessage={
        sender:req.user._id,
        content,
        chat:chatId,
    }
    try {
        var message=await Message.create(newMessage);
        message=await message.populate("sender","name pic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email",
        })
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message,
        })
        res.json(message);
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})
const allMessages=asyncHandler(async(req,res)=>{
    try {
       const message=await Message.find({chat:req.params.chatId}).populate(
            "sender","name pic email"
        ).populate("chat");
        res.json(message);
    } catch (error) {
       res.status(400);
        throw new Error(error.message);
    }
})
module.exports={sendMessage,allMessages};

