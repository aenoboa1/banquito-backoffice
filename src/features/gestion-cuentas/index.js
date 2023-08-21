import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import {ContainedGroup} from "./components/ContainedGroup";


function GestionCuentas() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <ContainedGroup/>
        </DashboardLayout>
    );
}

export default GestionCuentas;