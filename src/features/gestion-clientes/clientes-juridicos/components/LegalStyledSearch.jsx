import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import SearchIcon from '@mui/icons-material/Search';
import {Modal} from "@mui/material";
import Box from "@mui/material/Box";
import {SearchLegalForm} from "./SearchLegalForm";

export default function LegalStyledSearch() {
    const [openChip, setOpenAddress] = React.useState(false);
    const handleOpenChip = () => setOpenAddress(true);
    const handleCloseChip = () => setOpenAddress(false);
    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#f7f8f9",
        boxShadow: 24,
        borderRadius: '3px',
        p: 4
    };
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Chip
                label="Buscar Empresa"
                onClick={handleOpenChip}
                size="medium"
                color='primary'
                variant='outlined'
                icon={<SearchIcon/>}
            />

            <Modal
                open={openChip}
                onClose={handleCloseChip}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{backdropFilter: "blur(5px)"}}
            >
                <Box sx={style}>
                    <SearchLegalForm/>
                </Box>
            </Modal>
        </Stack>
    );
}
