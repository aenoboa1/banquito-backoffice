import React, {useState} from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import {AddClientForm} from "./AddClientForm";
import Collapse from "@mui/material/Collapse";
import useStateContext from "../../../../context/custom/useStateContext";
import SoftBox from "../../../../components/SoftBox";
import CustomDeleteIconChips from "./StyledSearch";

export const ClientMainPage = () => {
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
                    <CustomDeleteIconChips/>
                </Grid>
                <Grid item xs={4}>
                    <div>
                        <Button onClick={handleToggleForm} variant="contained">
                            {isFormVisible ? "Cancelar" : "Añadir Cliente"}
                        </Button>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    <SoftBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="90vh"
                    >
                        <Grid item xs={6.3}>
                            {isFormVisible && (
                                <Collapse in={isFormVisible} unmountOnExit>
                                    <div style={{marginRight: "40px"}}>
                                        <AddClientForm/>
                                    </div>
                                </Collapse>
                            )}
                        </Grid>
                    </SoftBox>
                </Grid>


            </Grid>

        </>
    );
};
