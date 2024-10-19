import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import './App.css';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Login from './pages/Login';
import CompositionSpecifique from './pages/Mediterane/CompositionSpecifique';
import CentreCompositionSpecifique from './pages/Centre/CentreCompositionSpecifique'; 
import NorthCompositionSpecifique from './pages/North/NorthCompositionSpecifique'; 
import SudCompositionSpecifique from './pages/Sud/SudCompositionSpecifique'; 
import CentreBiostatDataPage from './pages/Centre/CentreBiostatDataPage'; 
import CentreImportData from './pages/Centre/CentreImportData'; 
import CentreParametresEnvironnementaux from './pages/Centre/CentreParametresEnvironnementaux'; 
import CentreResultatParEspece from './pages/Centre/CentreResultatParEspece'; 

import NorthBiostatDataPage from './pages/North/NorthBiostatDataPage'; 
import NorthImportData from './pages/North/NorthImportData'; 
import NorthParametresEnvironnementaux from './pages/North/NorthParametresEnvironnementaux'; 
import NorthResultatParEspece from './pages/North/NorthResultatParEspece'; 
import SudBiostatDataPage from './pages/Sud/SudBiostatDataPage'; 
import SudImportData from './pages/Sud/SudImportData'; 
import SudParametresEnvironnementaux from './pages/Sud/SudParametresEnvironnementaux'; 
import SudResultatParEspece from './pages/Sud/SudResultatParEspece'; 
import Register from './Register';
import { Toaster } from 'react-hot-toast';
import UserLaout from './Layouts/UserLaout';
import AdminLayout from './Layouts/AdminLayout';
import PublicLayout from './Layouts/PublicLayout';
import 'leaflet/dist/leaflet.css';
import ParametresEnvironnementaux from './pages/Mediterane/ParametresEnvironnementaux';
import ResultatParEspece from './pages/Mediterane/ResultatParEspece';
import Settings from './pages/Settings';
import ImportData from './pages/Mediterane/ImportData';
import BiostatDataPage from './pages/Mediterane/BiostatDataPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>
          
          <Route path="/" element={<UserLaout />}>
            <Route index element={<Home />} />
            <Route path="dashboard/composition-specifique" element={<CompositionSpecifique />} />
            <Route path="dashboard/parametres-environnementaux" element={<ParametresEnvironnementaux />} />
            <Route path="dashboard/resultat-par-espece" element={<ResultatParEspece />} />
            
            <Route path="dashboard/centre-composition-specifique" element={<CentreCompositionSpecifique />} />
            <Route path="dashboard/centre-parametres-environnementaux" element={<CentreParametresEnvironnementaux />} />
            <Route path="dashboard/centre-resultat-par-espece" element={<CentreResultatParEspece />} />
            <Route path="dashboard/North-composition-specifique" element={<NorthCompositionSpecifique />} />
            <Route path="dashboard/North-parametres-environnementaux" element={<NorthParametresEnvironnementaux />} />
            <Route path="dashboard/North-resultat-par-espece" element={<NorthResultatParEspece />} />
            <Route path="dashboard/sud-composition-specifique" element={<SudCompositionSpecifique />} />
            <Route path="dashboard/sud-parametres-environnementaux" element={<SudParametresEnvironnementaux />} />
            <Route path="dashboard/sud-resultat-par-espece" element={<SudResultatParEspece />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Admin />} />
            <Route path="register" element={<ProtectedRoute><Register /></ProtectedRoute>} />
            <Route path="import" element={<ProtectedRoute><ImportData /></ProtectedRoute>} />
            <Route path="biostat-data" element={<ProtectedRoute><BiostatDataPage /></ProtectedRoute>} />
          
            <Route path="centre-import" element={<CentreImportData />} />
            <Route path="centre-biostat-data" element={<CentreBiostatDataPage />} />
            <Route path="North-import" element={<NorthImportData />} />
            <Route path="North-biostat-data" element={<NorthBiostatDataPage />} />
            <Route path="sud-import" element={<SudImportData />} />
            <Route path="sud-biostat-data" element={<SudBiostatDataPage />} />
          </Route>

          <Route path="/" element={<PublicLayout />}>
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
