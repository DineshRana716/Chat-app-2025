import React from "react";  
import  ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../Context/ChatProvider";
import { Tooltip,Avatar } from "@chakra-ui/react";
import {isSameUser,isSameSender,isLastMessage,issamesendermargin } from "../config/ChatLogics";


const ScrollableChat = ({messages}) => {
    const {user} = ChatState();
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: 'flex' }} key={m._id}>
                    {(m.sender._id !== user._id) && (i === messages.length - 1 || messages[i + 1].sender._id !== m.sender._id) && (
                        <Tooltip
                            label={m.sender.name}
                            placement="bottom-start"
                            hasArrow
                        >
                            <Avatar
                                mt="7px" ml={1}
                                mr={1}
                                size="sm"
                                cursor="pointer"
                                name={m.sender.name}
                                src={m.sender.pic}
                            />
                        </Tooltip>
                    )}
                    <span style={{  
                        backgroundColor:`${
                            m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                        }` ,
                        borderRadius:"20px",
                        padding:"5px 15px",
                        maxWidth:"75%",
                        marginLeft:issamesendermargin(messages,m,i,user._id),
                        marginTop:isSameUser(messages,m,i,user._id)?3:10,
                }}>{m.content}</span>
            </div>
          ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
