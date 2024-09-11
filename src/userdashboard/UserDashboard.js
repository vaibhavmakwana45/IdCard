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
import "./style.css";

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
    <section
      className="home"
      style={{
        backgroundImage: `${bgImage}`,
      }}
    >
      <div className="scalloped-shape">
        <img
          src={`https://cdn.savajcapital.com/cdn/files/${userData?.userimage}`}
          alt="User"
        />
        <div className="name-text">
          <h1>
            Name: <span>Darshan Vaghani</span>
          </h1>
          <h1>
            Mo No: <span>+91991391499</span>
          </h1>
        </div>
      </div>
    </section>
  );
}

// import React from "react";
// import "./style.css";

// const NavratriPass = () => {
//   return (
//     <section
//       className="home"
//       style={{
//         backgroundImage: "url(./day1.png)",
//       }}
//     >
//       <div className="scalloped-shape">
//         <img src="./user-2.jpg" alt="User" />
//         <div className="name-text">
//           <h1>
//             Name: <span>Darshan Vaghani</span>
//           </h1>
//           <h1>
//             Mo No: <span>+91991391499</span>
//           </h1>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NavratriPass;
