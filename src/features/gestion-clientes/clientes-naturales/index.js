import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {ClientMainPage} from "./components/ClientMainPage";


function GestionNaturales() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <ClientMainPage/>
        </DashboardLayout>
    );
}

export default GestionNaturales;
