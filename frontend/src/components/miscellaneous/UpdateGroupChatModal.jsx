import React, { useState } from "react";
import {
  IconButton,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  FormControl,
  Input,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner"; 

const UpdateGroupChatModal = ({ fetchMessages,fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  //const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloding, setRenameloding] = useState(false);
  const { selectedChat, setSelectedChat, user } = ChatState();

  const toast = useToast();

  const handleRename= async ()=>{
    if (!groupChatName) return;
    try {
      setRenameloding(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      const {data}=await axios.put(
        "http://localhost:5000/api/chats/rename",  
        {
          chatId:selectedChat._id,
          chatName:groupChatName
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameloding(false);
    } catch (error) {
      toast({
        title:"Error Occurred!",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      setRenameloding(false);
    }
    setGroupChatName("");
  }


  
  const handleSearch=async(query)=>{
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/users?searchTerm=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };
  const handleAddUser=async(user1)=>{
    if(selectedChat.users.find((u)=>u._id===user1._id)){
      toast({
        title:"User Already in Group",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      return;
    }
    if(selectedChat.groupAdmin._id!==user._id){
      toast({
        title:"Only Admin can add someone to the group",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      return;
    }
    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      const {data}=await axios.put(
        "http://localhost:5000/api/chats/groupadd",  
        {
          chatId:selectedChat._id,
          userId:user1._id
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      
    } catch (error) {
      toast({
        title:"Error Occurred!",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      setLoading(false);
    }
  }
  const handleRemove=async(user1)=>{
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title:"Only Admin can remove someone from the group",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      return;
    }
    try {
      setLoading(true);
      const config={
        headers:{
          Authorization:`Bearer ${user.token}`
        },
      };
      const {data}=await axios.put(
        "http://localhost:5000/api/chats/groupremove",  
        {
          chatId:selectedChat._id,
          userId:user1._id
        },
        config
      );
        user1._id===user._id
        ?setSelectedChat()
        :setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
      
    } catch (error) {
      toast({
        title:"Error Occurred!",
        description:error.response.data.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom",
      })
      setLoading(false);
    }
  }

  return (
    <>
      <IconButton     
        icon={<ViewIcon />}
        onClick={onOpen}
        display={{ base: "flex" }}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameloding}
                onClick={handleRename}
              >
                Rename
              </Button>

            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ?(<Spinner size="lg"/>) : (
              searchResult?.map((user)=>(
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={()=>handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
