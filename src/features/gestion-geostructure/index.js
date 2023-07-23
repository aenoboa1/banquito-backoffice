import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";


function GestionGeoStructure() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <GestionGeoStructure/>
        </DashboardLayout>
    );
}

export default GestionGeoStructure;