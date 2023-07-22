import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {ClientPagination} from "./components/ClientPagination";


function GestionNaturales() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <ClientPagination />
        </DashboardLayout>
    );
}

export default GestionNaturales;
