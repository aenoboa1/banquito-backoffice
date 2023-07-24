import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Accounts from "./components/Accounts";


function GestionCuentas() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Accounts />
        </DashboardLayout>
    );
}

export default GestionCuentas;