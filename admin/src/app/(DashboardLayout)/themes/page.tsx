"use client";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import {
  Button,
  Modal,
  Box,
  TextField,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { severConfig } from "@/server/config";

interface ActionsCellProps {
  params: GridRenderCellParams;
  handleEditClick: (row: any) => void;
  handleDeleteClick: (row: any) => void;
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  params,
  handleEditClick,
  handleDeleteClick,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => handleEditClick(params.row)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDeleteClick(params.row)}>
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

const SamplePage: React.FC = () => {
  const [myDate, setMyDate] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [editedUrl, setEditedUrl] = useState("");
  const [editedName, setEditedName] = useState("");

  const getDate = async () => {
    try {
      const { data } = await axios.get(`${severConfig.uri}/get-theme`);
      setMyDate(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = useCallback((row: any) => {
    setSelectedTheme(row);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDeleteClick = async () => {
    try {
      await axios.get(
        `${severConfig.uri}/delete-theme?id=${selectedTheme?.id}`
      );
      getDate(); // Refrescar datos
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = useCallback((row: any) => {
    setSelectedTheme(row);
    setEditedUrl(row.url);
    setEditedName(row.name);
    setIsEditModalOpen(true);
  }, []);

  const handleSaveClick = async () => {
    try {
      await axios.post(`${severConfig.uri}/update-theme`, {
        url: editedUrl,
        name: editedName,
        id: selectedTheme.id,
      });
      getDate(); // Refrescar datos
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDate();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "url", headerName: "URL", width: 500 },
    { field: "createdAt", headerName: "Created At", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <ActionsCell
          params={params}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <DataGrid
        rows={myDate}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 20 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Edit Theme</h2>
          <TextField
            fullWidth
            variant="outlined"
            label="URL"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSaveClick}>
            Save
          </Button>
        </Box>
      </Modal>
      <Modal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this theme?</p>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDeleteClick}
            sx={{ mr: 2 }}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
    </PageContainer>
  );
};

export default SamplePage;
