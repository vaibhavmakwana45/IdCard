// 
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";

export default function NavratriPass() {
  const cardBgImage = "https://i.ytimg.com/vi/-K9ZHQEO3Ic/maxresdefault.jpg";
  const userImage = "https://images.srkh.in/wp-content/uploads/2020/10/Navratri-Dandiya-Images.jpg";
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Flex
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bgColor={bgColor}
    >
      <Box
        w="350px"
        h="500px"
        borderRadius="lg"
        boxShadow="lg"
        textAlign="center"
        p={6}
        bg={`url(${cardBgImage})`}
        bgSize="cover"
        bgPosition="center"
        color={textColor}
        backdropFilter="blur(8px)"
      >
        <VStack spacing={4}>
          <Box
            bg="white"
            borderRadius="full"
            w="120px"
            h="120px"
            overflow="hidden"
            mx="auto"
            boxShadow="md"
          >
            <img src={userImage} alt="User" style={{ width: "100%", height: "auto" }} />
          </Box>
          <Heading fontSize="2xl">
            Navratri Pass
          </Heading>
          <Text fontSize="lg">
            2024
          </Text>
          <Text fontSize="md">
            Join us for a festive celebration of dance, music, and culture!
          </Text>
          <Box
            width="100%"
            height="200px"
            bg="rgba(255, 255, 255, 0.7)"
            borderRadius="md"
            boxShadow="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            backdropFilter="blur(4px)"
          >
            <Text
              fontSize="xl"
              fontWeight="bold"
              textAlign="center"
            >
              Entry Pass
            </Text>
          </Box>
          <Button colorScheme="yellow" variant="solid" mt={4} w="full">
            Get Your Pass
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
}
