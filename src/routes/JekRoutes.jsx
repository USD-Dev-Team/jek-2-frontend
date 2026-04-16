import Dashboard from "../pages/JEK/Dashboard";
import Home from "../pages/JEK/Home";
import Murojatlar from "../pages/JEK/Murojatlar ";

const JekRoutes = [
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
   
];
export default JekRoutes