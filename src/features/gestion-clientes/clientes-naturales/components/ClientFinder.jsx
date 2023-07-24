import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import {AddClientForm} from "./AddClientForm";
import StyledSearch from "./StyledSearch";
import Collapse from "@mui/material/Collapse";
import useStateContext from "../../../../context/custom/useStateContext";
import {Stack} from "@mui/material";
import SoftBox from "../../../../components/SoftBox";

export const ClientFinder = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const {context, setContext} = useStateContext();


    const handleToggleForm = () => {
        setIsFormVisible((prev) => !prev);

        setContext({
            addresses: null,
            phones: null,
        });
    };


    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <StyledSearch/>
                </Grid>
                <Grid item xs={4}>
                    <div>
                        <Button onClick={handleToggleForm} variant="contained">
                            {isFormVisible ? "Cancelar" : "Añadir Cliente"}
                        </Button>
                    </div>
                </Grid>
                <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="90vh"
                >
                    <Grid item xs={5}>
                        {isFormVisible && (
                            <Collapse in={isFormVisible} unmountOnExit>
                                <div style={{ marginRight: "40px" }}>
                                        <AddClientForm/>
                                </div>
                            </Collapse>
                        )}
                    </Grid>
                </SoftBox>



            </Grid>

        </>
    );
};
