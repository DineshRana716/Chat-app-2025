import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setfetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      minW={{ base: "300px", md: "300px" }}
      borderRadius="lg"
      borderWidth="1px"
      h="100%"
    >
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} />
    </Box>
  );
};

export default ChatBox;
