import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { LegalClientFinder } from "./components/LegalClientFinder";
import { Box } from "@mui/material";


function GestionJuridicos() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
                <Box gridColumn="span 12">
                    <LegalClientFinder />
                </Box>
                <Box gridColumn="span 12">
                </Box>
            </Box>
        </DashboardLayout>
    );
}

export default GestionJuridicos;
