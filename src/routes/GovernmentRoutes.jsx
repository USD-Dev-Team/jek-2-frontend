import { elements } from "chart.js";
import Dashboard from "../pages/GOVERNMENT/DashboardGov";
import Hodimlar from "../pages/GOVERNMENT/Hodimlar";
import Home from "../pages/GOVERNMENT/HomeGov";
import Inspectionlar from "../pages/GOVERNMENT/Inspectionlar";
import Murojatlar from "../pages/GOVERNMENT/MurojatlarGov";
import JekMalumoti from "../pages/INSPECTION/JekMalumoti";
import Muammolar from "../pages/JEK/Muammolar";
import Profile from "../pages/JEK/Profile";


const GovernmentRoutes = [
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
    {
        name: "inspectionlar",
        path: "Inspectionlar",
        element: <Inspectionlar />
    },
    {
        name: "inspectionlar",
        path: "Inspectionlar/:id",
        element: <JekMalumoti />
    }

];
export default GovernmentRoutes