import Dashboard from "../pages/INSPECTION/DashboardINS";
import Hodimlar from "../pages/INSPECTION/HodimlarINS";
import Home from "../pages/INSPECTION/HomeINS";
import Murojatlar from "../pages/INSPECTION/MurojatlarINS";



const InspectionRoutes = [
    {
        name: "home",
        path: 'Home',
        element: <Home />
    },
    {
        name: "dashboard",
        path: 'Dashboard',
        element: <Dashboard />
    },
    {
        name: "murojat",
        path: 'Murojatlar',
        element: <Murojatlar/>
    },
    {
        name: "hodimlar",
        path: 'Hodimlar',
        element: <Hodimlar/>
    },

];
export default InspectionRoutes