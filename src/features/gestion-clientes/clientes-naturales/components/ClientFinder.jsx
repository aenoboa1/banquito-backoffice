import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import SoftButton from "../../../../components/SoftButton";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import SoftInput from "../../../../components/SoftInput";
import Button from "@mui/material/Button";
import {DialogTitle, Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {Close} from "@mui/icons-material";
import {AddClientForm} from "./AddClientForm";



export const ClientFinder = () => {
    const [value, setValue] = useState("");
    const [Error, setError] = useState("");
    const [result, setResult] = useState([]);
    function handleSearch(e) {
        e.preventDefault();
    }

    const style = {
        position: "absolute" ,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#f7f8f9", // Color
        boxShadow: 24,
        borderRadius: '3px',
        p: 4
    };


    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (


        <>
            <Grid container spacing={4}>
                <Grid item xs={8}>


                </Grid>
                <Grid item xs={4}>

                    <div>
                        <Button onClick={handleOpen} variant="contained">
                            Añadir Cliente
                        </Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                            style={{ backdropFilter: "blur(5px)" }}
                        >
                            {/* Apply styles here: */}
                            <Box sx={style}>
                                <AddClientForm/>
                            </Box>

                        </Modal>
                    </div>
                </Grid>

            </Grid>
        </>

    )
}