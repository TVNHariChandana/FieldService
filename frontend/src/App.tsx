import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import RoleSelection from "./pages/RoleSelection.tsx";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkOrders from "./pages/WorkOrders.tsx";
import CreateWorkOrder from "./pages/CreateWorkOrder.tsx";
import EditWorkOrder from "./pages/EditWorkOrder.tsx";
import KanbanBoard from "./pages/KanbanBoard.tsx";
import Customers from "./pages/Customers.tsx";
import Sites from "./pages/Sites.tsx";
import Parts from "./pages/Parts";
import Dispatcher from "./pages/Dispatcher.tsx";
import Technician from "./pages/Technician.tsx";
import CustomerPortal from "./pages/CustomerPortal.tsx";
import ManagerLogin from "./pages/ManagerLogin.tsx";
import DispatcherLogin from "./pages/DispatcherLogin.tsx";
import TechnicianLogin from "./pages/TechnicianLogin.tsx";
import CustomerLogin from "./pages/CustomerLogin.tsx";
import CreateServiceRequest from "./pages/CreateServiceRequest.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* First screen */}
                <Route path="/" element={<RoleSelection />} />
                <Route
                    path="/manager-login"
                    element={<ManagerLogin />}
                />


                <Route
                    path="/dispatcher-login"
                    element={<DispatcherLogin />}
                />

                <Route
                    path="/technician-login"
                    element={<TechnicianLogin />}
                />

                <Route
                    path="/customer-login"
                    element={<CustomerLogin />}
                />
                <Route
                    path="/service-requests/create"
                    element={<CreateServiceRequest />}
                />
                {/* Existing login page */}
                <Route path="/login" element={<Login />} />

                {/* Dashboards */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dispatcher" element={<Dispatcher />} />
                <Route path="/technician" element={<Technician />} />
                <Route path="/customer" element={<CustomerPortal />} />

                {/* Work Orders */}
                <Route path="/work-orders" element={<WorkOrders />} />
                <Route
                    path="/work-orders/create"
                    element={<CreateWorkOrder />}
                />
                <Route
                    path="/work-orders/edit/:id"
                    element={<EditWorkOrder />}
                />
                <Route
                    path="/work-orders/board"
                    element={<KanbanBoard />}
                />

                {/* Management */}
                <Route path="/customers" element={<Customers />} />
                <Route path="/sites" element={<Sites />} />
                <Route path="/parts" element={<Parts />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;