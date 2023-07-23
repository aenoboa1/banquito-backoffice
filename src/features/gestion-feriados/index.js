import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import HolidayPage from "./components/HolidayPage";

function GestionFeriados() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <HolidayPage/>
        </DashboardLayout>
    );
}

export default GestionFeriados;
