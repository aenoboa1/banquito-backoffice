import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import GeoStructure from "./components/GeoStructure";


function GestionGeoStructure() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <GeoStructure/>
        </DashboardLayout>
    );
}

export default GestionGeoStructure;