import {
  Button,
  Flex,
  FormControl,
  Text,
  useColorModeValue,
  Input,
} from "@chakra-ui/react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { SketchPicker } from "react-color";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import AxiosInstance from "config/AxiosInstance";
import TableComponent from "TableComponent";
import axios from "axios";

function LoanStatus() {
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [allLoanStatus, setAllLoanStatus] = useState([]);
  const textColor = useColorModeValue("gray.700", "white");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [loading, setLoading] = useState(true);
  const [loanstatus, setLoanStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLoanStatusId, setSelectedLoanStatusId] = useState("");
  const [selectedLoanStatus, setSelectedLoanStatus] = useState("");
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const [formData, setFormData] = useState({
    backgroundImage: "",
  });
  const getLoanStatusData = async () => {
    try {
      const response = await AxiosInstance.get("/loanstatus");
      if (response.data.success) {
        setAllLoanStatus(response.data.data);
        console.log(response);
        setLoading(false);
      } else if (response.data.statusCode === 201) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const filteredLoanStatus =
    searchTerm.length === 0
      ? allLoanStatus
      : allLoanStatus.filter((doc) =>
          doc.loanstatus.toLowerCase().includes(searchTerm.toLowerCase())
        );

  useEffect(() => {
    getLoanStatusData();
  }, []);

  const allHeaders = [
    // "Index",
    "Background Image",
    "Create Date",
    "Update Date",
    "Action",
  ];

  const formattedData = filteredLoanStatus.map((loanstatus, index) => [
    // index + 1,
    loanstatus.loanstatus,
    <img
      src={`https://cdn.savajcapital.com/cdn/files/${loanstatus.backgroundImage}`}
      alt="Background"
      width="100"
      height="100"
      style={{ marginBottom: "10px", paddingBottom: "10px" }}
    />,
    loanstatus.createdAt,
    loanstatus.updatedAt,
  ]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoanStatus, setIsLoanStatus] = useState(false);
  const [selectedIsLoanStatusId, setSelectedIsLoanStatusId] = useState(null);
  const cancelRef = React.useRef();

  const deleteLoanStatus = async (LoanStatusId) => {
    try {
      const response = await AxiosInstance.delete(
        `/loanstatus/${LoanStatusId}`
      );
      if (response.data.success) {
        setAllLoanStatus((prevLoanStatus) =>
          prevLoanStatus.filter(
            (status) => status.loanstatus_id !== LoanStatusId
          )
        );
        toast.success("Loan Status deleted successfully!");
      } else if (response.data.statusCode === 201) {
        toast.error("Don't have permission to delete");
      } else {
        toast.error(
          "Don't have permission to delete" || "Please try again later!"
        );
      }
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting bank:", error);
      toast.error(error);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDelete = (id) => {
    setSelectedIsLoanStatusId(id);
    setIsDeleteDialogOpen(true);
  };
  const handleEdit = () => {
    const doc = allLoanStatus[0]; // Get the first item
    if (doc) {
      setSelectedLoanStatusId(doc.loanstatus_id);
      setFormData({ backgroundImage: doc.backgroundImage || "" });
      setIsLoanStatus(true);
    } else {
      console.error("No loan status found.");
    }
  };


  useEffect(() => {
    console.log("All Loan Status:", allLoanStatus);
  }, [allLoanStatus]);

  const handleRow = (id) => {};

  console.log(formData, "formData");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, backgroundImage: "" })); // Clear existing backgroundImage
    }
  };


  const handleAddLoanStatus = async () => {
    try {
      let userimageUrl = formData.backgroundImage; // Use backgroundImage from formData

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("files", imageFile);

        const uploadResponse = await axios.post(
          "https://cdn.savajcapital.com/api/upload",
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (
          uploadResponse.data.status === "ok" &&
          uploadResponse.data.files.length > 0
        ) {
          userimageUrl = uploadResponse.data.files[0].filename;
        } else {
          toast.error("Failed to upload the image. Please try again.");
          setLoading(false);
          return;
        }
      }

      const response = await AxiosInstance.post("/loanstatus", {
        backgroundImage: userimageUrl,
      });

      if (response.data.success) {
        toast.success("Loan Status added successfully!");
        setIsLoanStatus(false);
        setSelectedLoanStatusId("");
        getLoanStatusData();
        setLoanStatus("");
      } else {
        toast.error(response.data.message || "Please try again later!");
      }
    } catch (error) {
      console.error("Submission error", error);
      toast.error("Failed to add. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const editLoanStatus = async (loanstatus) => {
    try {
      let userimageUrl = formData.backgroundImage; // Use existing image URL

      if (imageFile) {
        const imageData = new FormData();
        imageData.append("files", imageFile);

        const uploadResponse = await axios.post(
          "https://cdn.savajcapital.com/api/upload",
          imageData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (
          uploadResponse.data.status === "ok" &&
          uploadResponse.data.files.length > 0
        ) {
          userimageUrl = uploadResponse.data.files[0].filename;
        } else {
          toast.error("Failed to upload the image. Please try again.");
          setLoading(false);
          return;
        }
      }

      const response = await AxiosInstance.put(
        `/loanstatus/${selectedLoanStatusId}`,
        {
          backgroundImage: userimageUrl,
        }
      );

      if (response.data.success) {
        toast.success("Loan Status Updated successfully!");
        setIsLoanStatus(false);
        setSelectedLoanStatusId("");
        getLoanStatusData();
        setLoanStatus("");
        setSelectedColor("#ffffff");
      } else {
        toast.error(response.data.message || "Please try again later!");
      }
    } catch (error) {
      console.error("Submission error", error);
      toast.error("Failed to update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }} pb="0px">
          <CardHeader p="6px 0px 22px 0px">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              className="thead"
            >
              <Text
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="linear(to-r, #b19552, #212529)"
                bgClip="text"
                className="ttext d-flex"
              >
                All Loan Status
              </Text>
            </Flex>
            <Flex justifyContent="end">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name"
                width="250px"
                marginRight="10px"
                style={{
                  padding: "10px", // Padding for comfortable input
                  fontSize: "16px", // Font size
                  borderRadius: "8px", // Rounded corners
                  border: "2px solid #b19552", // Solid border with custom color
                  backgroundColor: "#ffffff", // White background
                  color: "#333333", // Text color
                  outline: "none", // Remove default outline
                  transition: "all 0.3s ease-in-out", // Smooth transitions
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle box shadow
                }}
              />

              {/* <Button
                onClick={() => {
                  setIsLoanStatus(true);
                }}
                colorScheme="blue"
                style={{
                  backgroundColor: "#b19552",
                  color: "#fff",
                }}
              >
                Add Image
              </Button> */}
            </Flex>
          </CardHeader>
          <CardBody>
            <TableComponent
              allLoanStatus={allLoanStatus}
              data={formattedData}
              textColor={textColor}
              borderColor={borderColor}
              loading={loading}
              allHeaders={allHeaders}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleRow={handleRow}
              showPagination={true}
            />
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
                Delete Loan Status
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
                  onClick={() => deleteLoanStatus(selectedIsLoanStatusId)}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        <AlertDialog
          isOpen={isLoanStatus}
          leastDestructiveRef={cancelRef}
          onClose={() => {
            setIsLoanStatus(false);
            setSelectedLoanStatusId("");
          }}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {selectedLoanStatusId
                  ? "Update Loan Status"
                  : "Add Loan Status"}
              </AlertDialogHeader>

              <AlertDialogBody>
                <FormControl id="imageUpload" mb={4} width="300px">
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={2}
                    color={textColor}
                  >
                    Upload Image via CDN
                  </Text>
                  <FormControl id="userimage" mt={4}>
                    <div>
                      <img
                        src={`https://cdn.savajcapital.com/cdn/files/${formData.backgroundImage}`}
                        alt="Uploade Image First"
                        width="100"
                        height="100"
                        style={{ marginBottom: "10px", paddingBottom: "10px" }}
                      />
                    </div>

                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                </FormControl>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    setIsLoanStatus(false);
                    setSelectedLoanStatusId("");
                  }}
                  style={{
                    backgroundColor: "#414650",
                    border: "2px solid #b19552",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={() => {
                    if (selectedLoanStatusId) {
                      editLoanStatus();
                    } else {
                      handleAddLoanStatus();
                    }
                  }}
                  ml={3}
                  type="submit"
                  style={{
                    backgroundColor: "#b19552",
                    color: "#fff",
                  }}
                >
                  {selectedLoanStatusId ? "Update Now" : "Add Now"}
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

export default LoanStatus;
