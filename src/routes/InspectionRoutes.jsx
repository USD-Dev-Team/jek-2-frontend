import Dashboard from "../pages/INSPECTION/DashboardINS";
import Hodimlar from "../pages/INSPECTION/HodimlarINS";
import Home from "../pages/INSPECTION/HomeINS";
import JekMalumoti from "../pages/INSPECTION/JekMalumoti";
import Murojatlar from "../pages/INSPECTION/MurojatlarINS";
import Muammolar from "../pages/JEK/Muammolar";
import Profile from "../pages/JEK/Profile";



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
        name: "account",
        path: 'Account',
        element: <Profile />
    },
    {
        name: "muammo",
        path: 'Murojatlar/:id',
        element: <Muammolar />
    },
    {
        name: "malumot",
        path: 'Hodimlar/:id',
        element: <JekMalumoti />
    },

];
export default InspectionRoutes