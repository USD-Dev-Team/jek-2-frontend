import Dashboard from "../pages/JEK/Dashboard";
import Home from "../pages/JEK/Home";
import Muammolar from "../pages/JEK/Muammolar";
import Murojatlar from "../pages/JEK/Murojatlar ";
import Profile from "../pages/JEK/Profile";

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
    {
        name:"account",
        path:'Account',
        element:<Profile />
    },
    {
        name:"Muammo",
        path:'Murojatlar/:id',
        element:<Muammolar />
    },
   
];
export default JekRoutes