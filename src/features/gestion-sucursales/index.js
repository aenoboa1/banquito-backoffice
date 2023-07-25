import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import BasicCard from "./components/BasicCard";
import BranchesList from "./components/BranchesList";
import {BranchForm} from "./components/BranchForm";
import {createAPIEndpoint, ENDPOINTS} from "../../api";

function GestionSucursales() {
    return (

        <DashboardLayout>
            <DashboardNavbar/>
            <BasicCard/>
        </DashboardLayout>

    );
}

export default GestionSucursales;
