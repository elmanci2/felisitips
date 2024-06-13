"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { severConfig } from "@/server/config";
import { Box, Button, FormLabel, Stack, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

const AddTheme = () => {
  const [info, setInfo] = useState({
    name: "",
    url: "",
  });

  const handleData = async (event: any) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `${severConfig.uri}/add-addTheme`,
        info
      );
      console.log(data);
      toast.success("Theme added successfully");
      setInfo({
        name: "",
        url: "",
      });
    } catch (error) {
      toast.error("Error adding the theme");
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    console.log(name, value);

    setInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  return (
    <PageContainer title="Add Themes" description="This is add-themes page">
      <DashboardCard>
        <Stack gap={4}>
          <Stack direction={"column"} gap={1.5}>
            <Box>
              <FormLabel>Image URL</FormLabel>
              <TextField
                onChange={handleChange}
                name="url"
                value={info.url}
                variant="outlined"
                color="primary"
                label="Image URL"
                required
                sx={{ minWidth: "100%" }}
              />
            </Box>
            <Box>
              <FormLabel>Name</FormLabel>
              <TextField
                onChange={handleChange}
                name="name"
                value={info.name}
                variant="outlined"
                color="primary"
                label="Name"
                required
                sx={{ minWidth: "100%" }}
              />
            </Box>
          </Stack>

          <Box>
            <Button
              onClick={handleData}
              color="primary"
              variant="contained"
              size="large"
              fullWidth
              type="submit"
            >
              Add
            </Button>
          </Box>
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default AddTheme;
