import {
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useHistory, useLocation } from "react-router-dom";
import AxiosInstance from "config/AxiosInstance";
import axios from "axios";

function AddUser(props) {
  const location = useLocation();
  const textColor = useColorModeValue("gray.700", "white");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    groupname: "",
    groupimage: "",
    groupnumber: "",
    groupmobilnumber: "",
    groupcount: "",
    email: "",
    password: "",
  });

  const getData = async () => {
    try {
      const response = await AxiosInstance.get("/savaj_user/savaj_user/" + id);
      if (response.data.success) {
        const { user } = response.data;
        const submissionData = {
          groupname: user.groupname,
          groupnumber: user.groupnumber,
          groupmobilnumber: user.groupmobilnumber,
          groupcount: user.groupcount,
          email: user.email,
          password: user.password,
          groupimage: user.groupimage,
        };

        setFormData(submissionData);
      } else {
        alert("Please try again later...!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Clear the existing image URL if a new file is selected
      setFormData({ ...formData, groupimage: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let groupImageUrl = formData.groupimage; // Default to the existing image URL

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
          groupImageUrl = uploadResponse.data.files[0].filename;
        } else {
          toast.error("Failed to upload the image. Please try again.");
          setLoading(false);
          return;
        }
      }

      const submissionData = {
        userDetails: {
          groupname: formData.groupname,
          groupnumber: formData.groupnumber,
          groupmobilnumber: formData.groupmobilnumber,
          groupcount: formData.groupcount,
          email: formData.email,
          password: formData.password,
          groupimage: groupImageUrl,
        },
      };

      let response;
      if (!id) {
        response = await AxiosInstance.post(
          "/savaj_user/addsavajuser",
          submissionData
        );
      } else {
        response = await AxiosInstance.put(
          "/addusers/edituser/" + id,
          submissionData.userDetails
        );
      }

      if (response.data.success) {
        toast.success(`User ${id ? "updated" : "added"} successfully!`);
        history.push("/superadmin/alluser");
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

  return (
    <>
      <Flex direction="column" pt={{ base: "120px", md: "75px" }}>
        <Card overflowX={{ sm: "scroll", xl: "hidden" }}>
          <CardHeader p="6px 0px 22px 0px">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="xl" color={textColor} fontWeight="bold">
                Add Group
              </Text>
            </Flex>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <FormControl id="groupimage" mt={4}>
                <FormLabel>Upload Group Image</FormLabel>
                {formData.groupimage && (
                  <img
                    src={`https://cdn.savajcapital.com/cdn/files/${formData.groupimage}`}
                    alt="Group"
                    width="100"
                    height="100"
                    style={{ marginBottom: "10px", paddingBottom: "10px" }}
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormControl id="groupname" mt={4} isRequired>
                <FormLabel>Group Name</FormLabel>
                <Input
                  name="groupname"
                  onChange={handleChange}
                  value={formData.groupname}
                  placeholder="Enter your Name"
                />
              </FormControl>

              <FormControl id="groupnumber" mt={4} isRequired>
                <FormLabel>Group Number</FormLabel>
                <Input
                  name="groupnumber"
                  onChange={handleChange}
                  value={formData.groupnumber}
                  placeholder="Enter Group Number"
                />
              </FormControl>

              <FormControl id="groupmobilnumber" mt={4} isRequired>
                <FormLabel>Enter Group Mobile Number</FormLabel>
                <Input
                  name="groupmobilnumber"
                  type="number"
                  onChange={handleChange}
                  value={formData.groupmobilnumber}
                  placeholder="Enter Group mobile number"
                />
              </FormControl>

              <FormControl id="groupcount" mt={4} isRequired>
                <FormLabel>Enter Group Count</FormLabel>
                <Input
                  name="groupcount"
                  type="number"
                  onChange={handleChange}
                  value={formData.groupcount}
                  placeholder="Enter Group Count"
                />
              </FormControl>

              <Text fontSize="xl" color={textColor} fontWeight="bold" mt={6}>
                Login Credentials
              </Text>
              <FormControl id="email" mt={4} isRequired>
                <FormLabel>Group UserId</FormLabel>
                <Input
                  name="email"
                  type="text"
                  onChange={handleChange}
                  value={formData.email}
                  placeholder="Enter group userId"
                />
              </FormControl>
              <FormControl id="password" mt={4} isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  name="password"
                  type="text"
                  onChange={handleChange}
                  value={formData.password}
                  placeholder="Enter your Password"
                />
              </FormControl>
              <Button
                mt={4}
                type="submit"
                isLoading={loading}
                loadingText="Submitting"
                style={{
                  marginTop: 20,
                  backgroundColor: "#b19552",
                  color: "#fff",
                }}
              >
                Submit
              </Button>
              <Button
                mt={4}
                style={{
                  marginTop: 20,
                  marginLeft: 8,
                  backgroundColor: "#414650",
                  color: "#fff",
                }}
                onClick={() => history.push("/superadmin/alluser")}
              >
                Cancel
              </Button>
            </form>
          </CardBody>
        </Card>
      </Flex>
      <Toaster />
    </>
  );
}

export default AddUser;
