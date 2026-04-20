import Dashboard from "../pages/INSPECTION/DashboardINS";
import Hodimlar from "../pages/INSPECTION/HodimlarINS";
import Home from "../pages/INSPECTION/HomeINS";
import Murojatlar from "../pages/INSPECTION/MurojatlarINS";
import Muammolar from "../pages/JEK/Muammolar";



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
        element: <Murojatlar />
    },
    {
        name: "hodimlar",
        path: 'Hodimlar',
        element: <Hodimlar />
    },
    {
        name: "muammo",
        path: 'Murojatlar/:id',
        element: <Muammolar />
    },

];
export default InspectionRoutes