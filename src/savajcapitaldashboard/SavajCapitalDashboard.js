// import {
//   Flex,
//   SimpleGrid,
//   Stat,
//   StatLabel,
//   StatNumber,
//   Text,
//   useColorMode,
//   useColorModeValue,
// } from "@chakra-ui/react";
// import Card from "components/Card/Card.js";
// import IconBox from "components/Icons/IconBox";
// import Loader from "react-js-loader";
// import { DocumentIcon } from "components/Icons/Icons.js";
// import React, { useEffect, useState } from "react";
// import { useHistory } from "react-router-dom";
// import AxiosInstance from "config/AxiosInstance";
// import { jwtDecode } from "jwt-decode";

// export default function SavajCapitalDashboard() {
//   const history = useHistory();
//   // Chakra Color Mode
//   const iconBlue = useColorModeValue("#b19552", "#b19552");
//   const iconBoxInside = useColorModeValue("white", "white");
//   const textColor = useColorModeValue("gray.700", "white");
//   const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
//   const borderColor = useColorModeValue("gray.200", "gray.600");
//   const textTableColor = useColorModeValue("gray.500", "white");

//   const { colorMode } = useColorMode();
//   const [apiData, setApiData] = useState({});
//   const [totalAmounts, setTotalAmounts] = useState({});
//   const [accessType, setAccessType] = useState("");
//   React.useEffect(() => {
//     const jwt = jwtDecode(localStorage.getItem("authToken"));
//     setAccessType(jwt._id);
//   }, []);

//   const fetchData = async () => {
//     try {
//       if (!accessType.state || !accessType.city) {
//         console.error("State or city is missing.");
//         return;
//       }
//       const loanIds = accessType?.loan_ids.join(",");

//       const response = await AxiosInstance.get(
//         `/allcount/loan-files-scbranch/${accessType.state}/${accessType.city}/${loanIds}`
//       );
//       setApiData(response.data);

//       const totalAmountPromises = response.data.map(async (loan) => {
//         const { loan_id, loantype_id } = loan;

//         const response = await AxiosInstance.get(
//           `/file_upload/scbranchamounts/${loan_id}/${loantype_id || "none"}/${
//             accessType.state
//           }/${accessType.city}`
//         );

//         return {
//           loan_id,
//           loantype_id,
//           totalAmount: response.data.totalAmount,
//         };
//       });

//       const totalAmountsData = await Promise.all(totalAmountPromises);
//       const totalAmountsMap = totalAmountsData.reduce(
//         (acc, { loan_id, loantype_id, totalAmount }) => {
//           if (!acc[loan_id]) {
//             acc[loan_id] = {};
//           }
//           acc[loan_id][loantype_id || "none"] = totalAmount;
//           return acc;
//         },
//         {}
//       );
//       setTotalAmounts(totalAmountsMap);
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, [accessType]);

//   return (
//     <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
//       {apiData && apiData.length > 0 ? (
//         <SimpleGrid
//           columns={{ base: 1, sm: 1, md: 2, xl: 4 }}
//           spacing="24px"
//           mb="20px"
//         >
//           {apiData.map((loan) => (
//             <Card
//               key={loan.loan_id}
//               minH="125px"
//               style={{ cursor: "pointer", border: "1px solid black" }}
//               onClick={() =>
//                 history.push(`/savajcapitaluser/userfile`, {
//                   state: { loan: loan.loan, loan_id: loan.loan_id },
//                 })
//               }
//             >
//               <Flex direction="column">
//                 <Flex
//                   flexDirection="row"
//                   align="center"
//                   justify="center"
//                   w="100%"
//                   mb="25px"
//                 >
//                   <Stat me="auto">
//                     <StatLabel
//                       fontSize="xs"
//                       color="gray.400"
//                       fontWeight="bold"
//                       textTransform="uppercase"
//                     >
//                       {/* Check if loanType is not 'Unknown' to determine subtype */}
//                       {loan.loanType !== "Unknown"
//                         ? `${loan.loan} (${loan.loanType})`
//                         : loan.loan}
//                     </StatLabel>
//                     <Flex>
//                       <StatNumber
//                         fontSize="lg"
//                         color={textColor}
//                         fontWeight="bold"
//                         style={{ paddingTop: "10px", paddingBottom: "10px" }}
//                       >
//                         {loan.fileCount}
//                       </StatNumber>
//                     </Flex>
//                     <Text as="span" color="green.400" fontWeight="bold">
//                       ₹
//                       {totalAmounts[loan.loan_id]?.[
//                         loan.loantype_id || "none"
//                       ] || 0}
//                     </Text>
//                   </Stat>
//                   <IconBox
//                     borderRadius="50%"
//                     as="box"
//                     h={"45px"}
//                     w={"45px"}
//                     bg={iconBlue}
//                   >
//                     <DocumentIcon h={"24px"} w={"24px"} color={iconBoxInside} />
//                   </IconBox>
//                 </Flex>
//               </Flex>
//             </Card>
//           ))}
//         </SimpleGrid>
//       ) : (
//         <Flex justify="center" align="center" height="200px">
//           <Loader
//             type="spinner-circle"
//             bgColor={"#b19552"}
//             color={"black"}
//             size={50}
//           />
//         </Flex>
//       )}
//     </Flex>
//   );
// }

import {
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorMode,
  useColorModeValue,
  Box,
  Icon,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import IconBox from "components/Icons/IconBox";
import Loader from "react-js-loader";
import { DocumentIcon } from "components/Icons/Icons.js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import AxiosInstance from "config/AxiosInstance";
import { jwtDecode } from "jwt-decode";
import { GlobeIcon } from "components/Icons/Icons.js";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function SavajCapitalDashboard() {
  const history = useHistory();
  const iconBlue = useColorModeValue("#b19552", "#b19552");
  const iconBoxInside = useColorModeValue("white", "white");
  const textColor = useColorModeValue("gray.700", "white");
  const tableRowColor = useColorModeValue("#F7FAFC", "navy.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textTableColor = useColorModeValue("gray.500", "white");
  const { colorMode } = useColorMode();
  const [apiData, setApiData] = useState({});
  const [totalAmounts, setTotalAmounts] = useState({});
  const [accessType, setAccessType] = useState("");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const jwt = jwtDecode(localStorage.getItem("authToken"));
    setAccessType(jwt._id);
  }, []);

  // const fetchData = async () => {
  //   try {
  //     if (!accessType.state || !accessType.city) {
  //       console.error("State or city is missing.");
  //       return;
  //     }

  //     const response = await AxiosInstance.get(
  //       `/allcount/loan-files-scbranch/${accessType.state}/${accessType.city}/${accessType.branchuser_id}`
  //     );
  //     setApiData(response.data);

  //     const totalAmountPromises = response.data.map(async (loan) => {
  //       const { loan_id, loantype_id } = loan;

  //       const response = await AxiosInstance.get(
  //         `/file_upload/scbranchamounts/${loan_id}/${loantype_id || "none"}/${
  //           accessType.state
  //         }/${accessType.city}`
  //       );

  //       return {
  //         loan_id,
  //         loantype_id,
  //         totalAmount: response.data.totalAmount,
  //       };
  //     });

  //     const totalAmountsData = await Promise.all(totalAmountPromises);
  //     const totalAmountsMap = totalAmountsData.reduce(
  //       (acc, { loan_id, loantype_id, totalAmount }) => {
  //         if (!acc[loan_id]) {
  //           acc[loan_id] = {};
  //         }
  //         acc[loan_id][loantype_id || "none"] = totalAmount;
  //         return acc;
  //       },
  //       {}
  //     );
  //     setTotalAmounts(totalAmountsMap);
  //   } catch (error) {
  //     console.error("Failed to fetch data:", error);
  //   }
  // };
  // useEffect(() => {
  //   fetchData();
  // }, [accessType]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecorrds] = useState(0);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(
        `/addusers/getallusers/${accessType.group_id}`,
        {
          params: {
            page: currentPage,
            limit: itemsPerPage,
            searchTerm: searchTerm,
            selectedState: selectedState === "All State" ? "" : selectedState,
            selectedCity: selectedCity === "All City" ? "" : selectedCity,
          },
        }
      );
      console.log(response, "response");
      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalRecorrds(response.data.totalCount);
      setCurrentPage(response.data.currentPage);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    selectedState,
    selectedCity,
    accessType,
  ]);

  return (
    <Flex flexDirection="column" pt={{ base: "120px", md: "75px" }}>
      <SimpleGrid
        columns={{ base: 1, sm: 1, md: 2, xl: 5 }}
        spacing="24px"
        mb="20px"
      >
        <Card
          minH="169px"
          minW="200px"
          style={{
            cursor: "pointer",
            border: "1px solid #212529",
            background: "#E0E9FF",
            borderRadius: "16px 16px 16px 16px",
            position: "relative",
          }}
          // onClick={() => history.push("/superadmin/savajcapitalbranch")}
        >
          <Flex direction="column" p="0px">
            <Flex flexDirection="row" justify="space-between" align="center">
              <IconBox
                borderRadius="50%"
                as="box"
                h={"45px"}
                w={"45px"}
                bg={"#212529"}
              >
                <GlobeIcon h={"24px"} w={"24px"} color={iconBoxInside} />
              </IconBox>
              <Box
                borderRadius="50%"
                border="1px solid black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                h="24px"
                w="24px"
              >
                <Icon as={ArrowForwardIcon} h={3} w={3} color="black" />
              </Box>
            </Flex>
            <Stat mt="10px">
              <StatLabel fontSize="md" color="#212529" fontWeight="bold">
                Total Users
              </StatLabel>
              {/* <StatLabel fontSize="md" color="#212529" fontWeight="bold">
              (Savaj Capital)
            </StatLabel> */}
              <StatNumber fontSize="2xl" color={textColor} fontWeight="bold">
                {totalRecords}
              </StatNumber>
            </Stat>
          </Flex>
        </Card>
      </SimpleGrid>
    </Flex>
  );
}
