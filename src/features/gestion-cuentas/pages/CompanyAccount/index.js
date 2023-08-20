import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import CompanyAccountForm from "../../components/CompanyAccountForm";


function AccountsCompany() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <CompanyAccountForm/>
        </DashboardLayout>
    );
}

export default AccountsCompany;
