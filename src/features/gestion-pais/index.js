import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BasicCard from "./components/BasicCard";
import Country from "./components/Country";


function GestionPais() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <Country/>

        </DashboardLayout>
    );
}

export default GestionPais;
