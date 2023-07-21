import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BasicCard from "./components/BasicCard";


function GestionNaturales() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <BasicCard/>
        </DashboardLayout>
    );
}

export default GestionNaturales;
