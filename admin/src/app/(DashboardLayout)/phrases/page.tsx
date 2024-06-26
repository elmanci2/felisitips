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

const ActionsCell: React.FC<ActionsCellProps> = ({ params, handleEditClick, handleDeleteClick }) => {
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
        <MenuItem onClick={() => handleDeleteClick(params.row)}>Delete</MenuItem>
      </Menu>
    </>
  );
};

const Quote: React.FC = () => {
  const [myDate, setMyDate] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<any>(null);
  const [editedPhrase, setEditedPhrase] = useState("");
  const [editedAuthor, setEditedAuthor] = useState("");

  const getDate = async () => {
    try {
      const { data } = await axios.get(`${severConfig.uri}/get-phrase`);
      setMyDate(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = useCallback((row: any) => {
    setSelectedPhrase(row);
    setEditedPhrase(row.phrase);
    setEditedAuthor(row.by);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((row: any) => {
    setSelectedPhrase(row);
    setIsDeleteModalOpen(true);
  }, []);

  const handleSaveClick = async () => {
    try {
      await axios.post(`${severConfig.uri}/update-phrase`, {
        phrase: editedPhrase,
        by: editedAuthor,
        id: selectedPhrase.id,
      });
      getDate(); // Refresh data
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmDeleteClick = async () => {
    try {
      await axios.get(
        `${severConfig.uri}/delete-phrase?id=${selectedPhrase.id}`
      );
      getDate(); // Refresh data
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDate();
  }, []);

  const columns = [
    {
      field: "checkbox",
      headerName: "Checkbox",
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <input
          type="checkbox"
          checked={params.row.selected}
          onChange={() => {}}
        />
      ),
    },
    { field: "id", headerName: "ID", width: 90 },
    { field: "by", headerName: "Author", width: 200 },
    { field: "phrase", headerName: "Quote", width: 500 },
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
          <h2>Edit Phrase</h2>
          <TextField
            fullWidth
            variant="outlined"
            label="Author"
            value={editedAuthor}
            onChange={(e) => setEditedAuthor(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Phrase"
            value={editedPhrase}
            onChange={(e) => setEditedPhrase(e.target.value)}
            multiline
            rows={4}
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
          <p>Are you sure you want to delete this phrase?</p>
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

export default Quote;
