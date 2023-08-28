import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CustomerAccountForm from "../../components/CustomerAccountForm";


function CustomerAccount() {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <CustomerAccountForm/>
        </DashboardLayout>
    );
}

export default CustomerAccount;
