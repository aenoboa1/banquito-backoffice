import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {ClientFinder} from "./components/ClientFinder";


function GestionNaturales() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <ClientFinder/>
        </DashboardLayout>
    );
}

export default GestionNaturales;
