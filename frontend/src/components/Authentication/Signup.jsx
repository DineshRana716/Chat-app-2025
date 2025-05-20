import { FormControl, Hide } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Input,
  FormLabel,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => {
    setShow(!show);
  };

  const postDetails = async (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/png" || pics.type === "image/jpeg") {
      try {
        const data = new FormData();
        data.append("file", pics);
        data.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

        console.log("Cloudinary credentials:", {
          cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        });

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const result = await response.json();

        setPic(result.secure_url);
        setLoading(false);

        toast({
          title: "Image uploaded successfully",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Error uploading image",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword || !pic) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting to make signup request...");
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      console.log("Request payload:", { name, email, password, pic });
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log("Signup successful:", data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.error("Signup error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="signup-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="signup-email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="signup-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>
      </FormControl>
      <FormControl id="signup-confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
