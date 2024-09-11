import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AxiosInstance from "config/AxiosInstance";

export default function NavratriPass() {
  const cardBgImage = "/path/to/your/background-image"; // Add your custom background image here
  const userImage = "/path/to/your/user-image"; // Add user image here
  const groupImage = "/path/to/your/group-image"; // Add group image here

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessType, setAccessType] = useState("");

  React.useEffect(() => {
    const jwt = jwtDecode(localStorage.getItem("authToken"));
    setAccessType(jwt._id);
  }, []);

  useEffect(() => {
    if (!accessType) return;

    const fetchUserData = async () => {
      try {
        const response = await AxiosInstance.get(
          `/addusers/${accessType.user_id}`
        );
        if (response.data.success) {
          setUserData(response.data.user);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [accessType]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  const bgImage = userData?.backgroundImage
    ? `url('https://cdn.savajcapital.com/cdn/files/${userData?.backgroundImage}')`
    : cardBgImage;

  return (
    <Flex justifyContent="center" alignItems="center">
      <Box
        w="450px"
        h="700px"
        borderRadius="20px"
        boxShadow="2xl"
        textAlign="center"
        p={6}
        bgImage={bgImage}
        bgSize="100% 100%"
        bgPosition="center"
        color={textColor}
        // backdropFilter="blur(120px)"
        border="3px solid #FF7F50"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          background="rgba(0, 0, 0, 0.4)"
          borderRadius="20px"
          zIndex="-1"
        />

       
          {/* <Box
            borderRadius="full"
            w="250px" // Increased width
            h="250px" // Increased height
            overflow="hidden"
            mx="auto"
            boxShadow="lg"
            border="4px solid #FFAD60"
            position="relative"
            zIndex="1"
            bg="white"
          >
            <Image
              src={`https://cdn.savajcapital.com/cdn/files/${userData?.userimage}`}
              alt="User"
              objectFit="cover"
              boxSize="100%"
              borderRadius="full"
            />
          </Box> */}

          {/* 
          <Heading
            fontSize="4xl"
            color="yellow.300"
            textShadow="3px 3px 4px #FF6F61"
            fontWeight="extrabold"
            mb={4}
            textTransform="uppercase"
          >
            Navratri Festival Pass
          </Heading> */}
          {/* <Text
            fontSize="2xl"
            color="yellow.300"
            fontWeight="bold"
            mb={2}
            textShadow="2px 2px 4px #FF6F61"
          >
            2024
          </Text> */}
          {/* <Text
            fontSize="md"
            px={6}
            color="white"
            textShadow="10px 1px 4px #FF6F61"
            mb={6}
          >
            Celebrate the spirit of Navratri with vibrant dance, music, and joy!
          </Text> */}
          {/* 
          <Box
            width="100%"
            bg="rgba(255, 255, 255, 0.8)"
            borderRadius="md"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            backdropFilter="blur(4px)"
            textAlign="center"
            border="2px dashed #D9534F"
            mb={4}
          >
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
              Name: {userData?.fullname}
            </Text>
            <Text fontSize="sm" fontWeight="bold" color="gray.700">
              Email: {userData?.email}
            </Text>
          </Box> */}

          {/* <Image
            src={`https://cdn.savajcapital.com/cdn/files/${userData?.groupimage}`}
            alt="Group"
            boxSize="150px"
            objectFit="cover"
            borderRadius="md"
            boxShadow="lg"
          /> */}
        
      </Box>
    </Flex>
  );
}
