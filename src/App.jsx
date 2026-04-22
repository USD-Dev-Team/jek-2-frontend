import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import RequireAuth from './auth/RequireAuth'
import { Toaster } from 'react-hot-toast'
import ErrorPage from './pages/ErrorPage'
// import SuperAdminLayout from './layouts/SuperAdminLayout'
// import superAdminRoutes from './routes/superAdminRoutes'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import JekLayout from './layouts/JekLoyout'
import JekRoutes from './routes/JekRoutes'
import GovernmentLoyout from './layouts/GovernmentLoyout'
import GovernmentRoutes from './routes/GovernmentRoutes'
import "./i18n";
import InspectionRoutes from './routes/InspectionRoutes'
import InspectiontLoyout from './layouts/InspectionLoyout'
import Profile from './pages/JEK/Profile'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to={'/login'}/>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route element={<RequireAuth role="GOVERNMENT" />}>
          <Route path='/Government' element={<GovernmentLoyout />}>
            {GovernmentRoutes.map((r) => {
              return (
                <Route key={r.name} path={r.path} element={r.element} />
              )
            })}
          </Route>
        </Route>
        <Route element={<RequireAuth role="JEK" />}>
          <Route path='/jek' element={<JekLayout />}>
            {JekRoutes.map((r) => {
              return (
                <Route key={r.name} path={r.path} element={r.element} />
              )
            })}
          </Route>
        </Route>
        <Route element={<RequireAuth role="INSPECTION" />}>
          <Route path="/inspection" element={<InspectiontLoyout />}>
            {InspectionRoutes.map((r) => (
              <Route key={r.name} path={r.path} element={r.element} />
            ))}
          </Route>
        </Route>
        <Route path='*' element={<ErrorPage />} />
      </Routes>
      <Toaster
        position='top-center'
        toastOptions={{
          duration: 3000,
        }}
      />
    </>
  )
}

export default App
