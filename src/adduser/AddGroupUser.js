import axios from "axios";
import {
  Flex,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  Td,
  useColorModeValue,
  Button,
  IconButton,
  Input,
  Select,
  Collapse,
  Box,
} from "@chakra-ui/react";
import Loader from "react-js-loader";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import toast, { Toaster } from "react-hot-toast";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import AxiosInstance from "config/AxiosInstance";
// import "./user.css";
import { Country, State, City } from "country-state-city";
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

function AddGroupUser() {
  const [users, setUsers] = useState([]);
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, activate: true });
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);
  const cancelRef = React.useRef();
  const [accessType, setAccessType] = useState("");

  React.useEffect(() => {
    const jwt = jwtDecode(localStorage.getItem("authToken"));
    setAccessType(jwt._id);
  }, []);

  console.log(accessType, "vaibhav");

  const states = State.getStatesOfCountry("IN");

  const cities = selectedState
    ? City.getCitiesOfState(
        "IN",
        states.find((state) => state.name === selectedState)?.isoCode
      )
    : [];

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecorrds] = useState(0);

  const fetchData = async () => {
    try {
      const response = await AxiosInstance.get(`/addusers/getallgroupusers`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          searchTerm: searchTerm,
          selectedState: selectedState === "All State" ? "" : selectedState,
          selectedCity: selectedCity === "All City" ? "" : selectedCity,
        },
      });
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
  }, [currentPage, itemsPerPage, searchTerm, selectedState, selectedCity]);

  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      setCurrentPage(nextPage);
    }
  };

  const handlePrevPage = () => {
    const prevPage = currentPage - 1;
    if (prevPage >= 1) {
      setCurrentPage(prevPage);
    }
  };
  const requestActivateDeactivate = (userId, activate) => {
    setCurrentUser({ id: userId, activate });
    setIsConfirmOpen(true);
  };

  const handleActivateDeactivate = async () => {
    try {
      const { id, activate } = currentUser;
      const response = await AxiosInstance.put(
        `/addusers/toggle-active/${id}`,
        {
          isActivate: activate,
        }
      );

      if (response.data.success) {
        toast.success(
          `User has been ${
            activate ? "activated" : "deactivated"
          } successfully!`
        );
        setUsers(
          users.map((user) =>
            user.user_id === id ? { ...user, isActivate: activate } : user
          )
        );
        setIsConfirmOpen(false);
      } else {
        toast.error("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status.");
    }
  };

  const getCibilScoreCategory = (score) => {
    if (score >= 300 && score <= 499) {
      return "Poor";
    } else if (score >= 500 && score <= 649) {
      return "Average";
    } else if (score >= 650 && score <= 749) {
      return "Good";
    } else if (score >= 750 && score <= 900) {
      return "Excellent";
    } else {
      return "-";
    }
  };

  const getBackgroundColor = (category) => {
    switch (category) {
      case "Poor":
        return "#FFCCCC";
      case "Average":
        return "#FFF8CC";
      case "Good":
        return "#E5FFCC";
      case "Excellent":
        return "#CCE5FF";
      default:
        return "transparent";
    }
  };

  const getTextColor = (category) => {
    switch (category) {
      case "Poor":
        return "#990000";
      default:
        return "black";
    }
  };

  const handleDelete = (id) => {
    // setSelectedUserId(id);
    // setIsDeleteDialogOpen(true);
  };

  const handleEdit = (id) => {
    // history.push("/savajcapitaluser/addcustomer?id=" + id);
  };

  const toggleRowExpansion = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const deleteBranch = async (userId) => {
    try {
      const response = await AxiosInstance.delete(
        `/addusers/deleteuser/${userId}`
      );

      if (response.data.success) {
        setIsDeleteDialogOpen(false);
        toast.success("User deleted successfully!");
        setUsers(users.filter((user) => user.user_id !== userId));
      } else if (response.data.statusCode === 201) {
        toast.error(response.data.message);
        setIsDeleteDialogOpen(false);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("User not deleted");
    }
  };

  const rowBackgroundColor = "#FFFFFF"; // Your desired row background color
  // const rowTextColor = "#212529"; // Your desired row text color
  const hoverBackgroundColor = "#b19552"; // Your desired hover background color

  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Flex justifyContent="space-between" className="mainnnn">
              <Box textAlign="center" pb="4">
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  bgGradient="linear(to-r, #b19552, #212529)"
                  bgClip="text"
                  className="ttext"
                >
                  All Users
                </Text>
              </Box>
            </Flex>
            <Flex className="thead" justifyContent="end" alignItems="center">
              {/* <Select
                value={selectedState}
                onChange={handleStateChange}
                placeholder="Select State"
                width="250px"
                marginRight="10px"
                className="mb-0 drop"
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "2px solid #b19552",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  color: "#333333",
                  outline: "none",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <option value="All State">All State</option>
                {states.map((state) => (
                  <option key={state.isoCode} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </Select>

              <Select
                value={selectedCity}
                onChange={handleCityChange}
                placeholder="Select City"
                disabled={!selectedState}
                width="250px"
                marginRight="10px"
                className="mb-0 drop"
                style={{
                  padding: "5px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "2px solid #b19552",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  color: "#333333",
                  outline: "none",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                <option value="All City">All City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </Select>

              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
                width="250px"
                marginRight="10px"
                style={{
                  padding: "5px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  border: "2px solid #b19552",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  color: "#333333",
                  outline: "none",
                  transition: "all 0.3s ease-in-out",
                }}
              /> */}
              {/* <Button
                onClick={() => history.push("/savajcapitaluser/addcustomer")}
                colorScheme="blue"
                style={{
                  padding: "10px",
                  fontSize: "16px",
                  borderRadius: "8px",
                  backgroundColor: "#b19552",
                  color: "white",
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Add User
              </Button> */}
            </Flex>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Group Name</Th>
                  <Th>User Image</Th>
                  <Th>Full Name</Th>

                  <Th>Mobil Number</Th>

                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td colSpan="10">
                      <Flex justify="center" align="center" height="400px">
                        <Loader
                          type="spinner-circle"
                          bgColor={"#b19552"}
                          color={"black"}
                          size={50}
                        />
                      </Flex>
                    </Td>
                  </Tr>
                ) : users.length === 0 ? (
                  <Tr>
                    <Td colSpan="10">
                      <Flex justify="center" align="center" height="200px">
                        <Text
                          variant="h6"
                          color="textSecondary"
                          textAlign="center"
                        >
                          No data found
                        </Text>
                      </Flex>
                    </Td>
                  </Tr>
                ) : (
                  users.map((user, index) => (
                    <React.Fragment key={user.user_id}>
                      <Tr
                        onClick={() => toggleRowExpansion(index)}
                        cursor="pointer"
                        _hover={{
                          background: "#b19552",
                          cursor: "pointer",
                          textColor: "white",
                        }}
                      >
                        <Td>{index + 1}</Td>
                        <Td>{user.groupname || "N/A"}</Td>

                        <Td>
                          <img
                            src={`https://cdn.savajcapital.com/cdn/files/${user.userimage}`}
                            alt="User Image"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }} // adjust the size and style as per your need
                          />
                        </Td>

                        <Td>{user.fullname || "N/A"}</Td>

                        <Td>{user.email || "N/A"}</Td>
                        <Td>
                          <Flex>
                            <IconButton
                              aria-label="Edit"
                              icon={<EditIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(user.user_id);
                              }}
                              mr={2}
                              color="black"
                            />
                            <IconButton
                              aria-label="Delete"
                              icon={<DeleteIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(user.user_id);
                              }}
                              mr={2}
                              color="black"
                            />

                            {/* <IconButton
                              aria-label={
                                expandedRow === index ? "Collapse" : "Expand"
                              }
                              icon={
                                expandedRow === index ? (
                                  <ChevronUpIcon />
                                ) : (
                                  <ChevronDownIcon />
                                )
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleRowExpansion(index);
                              }}
                              color="black"
                            /> */}
                          </Flex>
                        </Td>
                      </Tr>
                      <Tr>
                        <Td
                          colSpan="10"
                          p={0}
                          border="none"
                          style={{
                            maxHeight: expandedRow === index ? "none" : "0",
                            overflow: "hidden",
                          }}
                        >
                          <Collapse in={expandedRow === index} animateOpacity>
                            <div
                              style={{
                                maxHeight:
                                  expandedRow === index ? "none" : "100%",
                                overflow: "hidden",
                              }}
                            >
                              <Table
                                variant="simple"
                                bg={useColorModeValue("gray.50", "gray.700")}
                                style={{ tableLayout: "fixed" }}
                              >
                                {/* <Thead>
                                  <Tr>
                                    <Th>Email</Th>
                                    <Th>Unit Address</Th>
                                    <Th>GST Number</Th>
                                    <Th>Aadhar Card</Th>
                                    <Th>Pan Card</Th>
                                    <Th>State</Th>
                                    <Th>City</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td>{user.email}</Td>
                                    <Td>{user.unit_address}</Td>
                                    <Td>{user.gst_number}</Td>
                                    <Td>{user.aadhar_card}</Td>
                                    <Td>{user.pan_card}</Td>
                                    <Td>{user.state}</Td>
                                    <Td>{user.city}</Td>
                                  </Tr>
                                </Tbody> */}
                              </Table>
                            </div>
                          </Collapse>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  ))
                )}
              </Tbody>
            </Table>
            <Flex
              justifyContent="flex-end"
              alignItems="center"
              p="4"
              // borderBottom="1px solid #ccc"
            >
              <Text mr="4" fontSize="sm">
                Total Records: {totalRecords}
              </Text>
              <Text mr="2" fontSize="sm">
                Rows per page:
              </Text>
              <Select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                mr="2"
                width="100px"
                fontSize="sm"
              >
                {[10, 20, 50].map((perPage) => (
                  <option key={perPage} value={perPage}>
                    {perPage}
                  </option>
                ))}
              </Select>
              <Text mr="4" fontSize="sm">
                Page {currentPage} of {totalPages}
              </Text>
              <IconButton
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                icon={<KeyboardArrowUpIcon />}
                mr="2"
                variant="outline"
                colorScheme="gray"
                size="sm"
              />
              <IconButton
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next Page"
                icon={<KeyboardArrowDownIcon />}
                variant="outline"
                colorScheme="gray"
                size="sm"
              />
            </Flex>
          </CardBody>
        </Card>
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete User
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => deleteBranch(selectedUserId)}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen={isConfirmOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsConfirmOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {currentUser.activate ? "Activate User" : "Deactivate User"}
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure you want to{" "}
                {currentUser.activate ? "activate" : "deactivate"} this user?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleActivateDeactivate}
                  ml={3}
                >
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Flex>

      <Toaster />
    </>
  );
}

export default AddGroupUser;
