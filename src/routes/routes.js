/**
 =========================================================
 * Soft UI Dashboard React - v4.0.1
 =========================================================

 * Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-react
 * Copyright 2023 Creative Tim (https://www.creative-tim.com)

 Coded by www.creative-tim.com

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

/**
 All of the routes for the Soft UI Dashboard React are added here,
 You can add a new route, customize the routes and delete the routes here.

 Once you add a new route on this file it will be visible automatically on
 the Sidenav.

 For adding a new route you can follow the existing routes in the routes array.
 1. The `type` key with the `collapse` value is used for a route.
 2. The `type` key with the `title` value is used for a title inside the Sidenav.
 3. The `type` key with the `divider` value is used for a divider between Sidenav items.
 4. The `name` key is used for the name of the route on the Sidenav.
 5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
 6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
 7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
 inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
 8. The `route` key is used to store the route location which is used for the react router.
 9. The `href` key is used to store the external links location.
 10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
 10. The `component` key is used to store the component of its route.
 */

// Soft UI Dashboard React layouts

// Soft UI Dashboard React layouts
import CreditCard from "../examples/Icons/CreditCard";
import GestionPais from "../features/gestion-pais";
import GestionFeriados from "../features/gestion-feriados";
import {AccountTreeOutlined, Business, Folder, PartyMode, Person, Public} from "@mui/icons-material";
import ClientesNaturales from "../features/gestion-clientes/clientes-naturales";
import ClientesJuridicos from "../features/gestion-clientes/clientes-juridicos";
import EntidadBancaria from "../features/entidad-bancaria";
import GestionGeostructure from "../features/gestion-geostructure";
import GestionGeolocation from "features/geolocation";
import GestionCuentas from "features/gestion-cuentas";
import GestionSucursales from "../features/gestion-sucursales";

import SearchTable from "../features/gestion-clientes/clientes-naturales/components/SearchTable";
import {UpdateClientForm} from "../features/gestion-clientes/clientes-naturales/components/UpdateClientForm";
import SearchLegalTable from "features/gestion-clientes/clientes-juridicos/components/SearchLegalTable";
import CustomerAccount from "../features/gestion-cuentas/pages/CustomerAccount";
import AccountsCompany from "../features/gestion-cuentas/pages/CompanyAccount";
import {UpdateLegalClientForm} from "../features/gestion-clientes/clientes-juridicos/components/UpdateLegalClientForm";

const routes = [
    {
        type: "collapse",
        name: "Entidad Bancaria",
        key: "entidadBancaria",
        route: "/entidadBancaria",
        icon: <CreditCard size="12px"/>,
        component: <EntidadBancaria/>,
        noCollapse: true,
    },
    {
        type: "collapse",
        name: "Gestion Paises",
        key: "pais",
        route: "/pais",
        icon: <Public size="12px"/>,
        component: <GestionPais/>,
        noCollapse: true,
    },
    {
        name: "Locaciones",
        key: "geoLocation",
        route: "/geolocation",
        icon: <AccountTreeOutlined size="12px"/>,
        component: <GestionGeolocation/>,
    },
    {
        type: "collapse",
        name: "Estructura Geográfica",
        key: "geostructure",
        route: "/geostructure",
        icon: <AccountTreeOutlined size="12px"/>,
        component: <GestionGeostructure/>,
    },
    
    {
        type: "collapse",
        name: "Gestion Feriados",
        key: "feriados",
        route: "/feriados",
        icon: <PartyMode size="12px"/>,
        component: <GestionFeriados/>,
        noCollapse: true,
    },
    {
        type: "collapse",
        name: "Gestion Sucursales",
        key: "sucursales",
        route: "/sucursales",
        icon: <CreditCard size="12px"/>,
        component: <GestionSucursales/>,
        noCollapse: true,
    },

    {
        type: "collapse",
        name: "Gest. Clientes Naturales",
        key: "clientesnaturales",
        route: "/clientesnaturales",
        icon: <Person size="12px"/>,
        component: <ClientesNaturales/>,
        noCollapse: true,
    },

    {
        type: "collapse",
        name: "Gest. Clientes Juridicos",
        key: "clientesjuridicos",
        route: "/clientesjuridicos",
        icon: <Business size="12px"/>,
        component: <ClientesJuridicos/>,
        noCollapse: true,
    },
    {
        type: "collapse",
        name: "Gestion Cuentas",
        key: "cuentas",
        route: "/cuentas",
        icon: <Folder size="12px"/>,
        component: <GestionCuentas/>,
        noCollapse: true,
    },
    {
        name: "ClientResults",
        key: "clientResults",
        route: "/cuentas/cliente",
        component: <CustomerAccount/>
    },
    {
        name: "CustomerAccounts",
        key: "customerAccounts",
        route: "/cuentas/compania",
        component: <AccountsCompany/>
    },

    {
        name: "ClientResults",
        key: "clientResults",
        route: "/clientesnaturales/results",
        component: <SearchTable/>
    },
    {
        name: "ClientEdit",
        key: "clientEdit",
        route: "/clientesnaturales/results/edit",
        component: <UpdateClientForm/>
    },

    {
        name: "LegalResults",
        key: "legalResults",
        route: "/clientesjuridicos/results",
        component: <SearchLegalTable/>
    },

    {
        name: "LegalEdit",
        key: "legalEdit",
        route: "/clientesjuridicos/results/edit",
        component: <UpdateLegalClientForm/>
    }
];

export default routes;