import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import useStateContext from "../../../../context/custom/useStateContext";
import { AddClientLegalForm } from "./AddClientLegalForm";
import StyledSearch from "../../clientes-naturales/components/StyledSearch";
import { AddCircleOutline } from "@mui/icons-material";
import LegalStyledSearch from "./LegalStyledSearch";

export const LegalClientFinder = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { context, setContext } = useStateContext();


    const handleToggleForm = () => {
        setIsFormVisible((prev) => !prev);

        setContext({
            groupMembers: null,
        });
    };

    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={8}>
                    <LegalStyledSearch />
                </Grid>
                <Grid item xs={4}>
                    <div>
                        <Button onClick={handleToggleForm} variant="contained" startIcon={<AddCircleOutline />}>
                            {isFormVisible ? "Cancelar" : "Añadir Empresa"}
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={10}>
                    {isFormVisible && (
                        <Collapse in={isFormVisible} unmountOnExit>
                            <Box
                                display="flex"
                                justifyContent="center"
                            >
                                <AddClientLegalForm />
                            </Box>
                        </Collapse>
                    )}
                </Grid>
            </Grid>
        </>
    );
};
