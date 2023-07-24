import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import GeoLocation from "./components/GeoLocation";


function GestionGeolocation() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <GeoLocation/>
        </DashboardLayout>
    );
}

export default GestionGeolocation;