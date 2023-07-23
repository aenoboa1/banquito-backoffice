import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {ClientFinder} from "./components/ClientFinder";
import Box from "@mui/material/Box";


function GestionNaturales() {
    return (
        <DashboardLayout>

            <DashboardNavbar/>
            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3}>
                <Box gridColumn="span 12">
                    <ClientFinder/>
                </Box>
                <Box gridColumn="span 12">
                </Box>
            </Box>


        </DashboardLayout>
    );
}

export default GestionNaturales;
