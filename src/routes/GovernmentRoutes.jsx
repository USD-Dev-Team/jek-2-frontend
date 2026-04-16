import Dashboard from "../pages/GOVERNMENT/DashboardGov";
import Hodimlar from "../pages/GOVERNMENT/Hodimlar";
import Home from "../pages/GOVERNMENT/HomeGov";
import Inspectionlar from "../pages/GOVERNMENT/Inspectionlar";
import Murojatlar from "../pages/GOVERNMENT/MurojatlarGov";


const GovernmentRoutes = [
    {
        name:"home",
        path:'Home',
        element:<Home />
    },
    {
        name:"dashboard",
        path:'Dashboard',
        element:<Dashboard />
    },
    {
        name:"murojat",
        path:'Murojatlar',
        element:<Murojatlar />
    },
    {
        name:"hodimlar",
        path:'Hodimlar',
        element:<Hodimlar />
    },
    {
        name:"inspectionlar",
        path:'Inspectionlar',
        element:<Inspectionlar />
    },
   
];
export default GovernmentRoutes