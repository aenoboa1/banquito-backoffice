import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BankEntityList from "../entidad-bancaria/components/BankEntityList";


function GestionEntidades() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <BankEntityList/>
        </DashboardLayout>
    );
}

export default GestionEntidades;
