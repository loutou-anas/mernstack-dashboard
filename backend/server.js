import express from 'express';
import dotenv from 'dotenv';
import AuthRoutes from './routes/AuthRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import cors from 'cors';
import Dbcon from './config/database.js';
import cookieParser from 'cookie-parser';
import DashboardRoutes from './routes/DashboardRoutes.js';


import AtlantiqueCentreRoutes from './routes/AtlantiqueCentreRoutes.js'; // Import Centre routes
import AtlantiqueSudRoutes from './routes/AtlantiqueSudRoutes.js'; // Import Sud routes
import AtlantiqueNorthRoutes from './routes/AtlantiqueNorthRoutes.js';  // Import Nord routes

dotenv.config();

const PORT = process.env.PORT || 8000;

// Connexion à la base de données
Dbcon();

const app = express();

app.use(cookieParser());
app.use(express.json());

// Configuration CORS
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173' 
}));

app.use('/api/auth', AuthRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/atlantique-centre', AtlantiqueCentreRoutes); // Register Centre routes
app.use('/api/atlantique-sud', AtlantiqueSudRoutes); // Register Sud routes
app.use('/api/atlantique-North', AtlantiqueNorthRoutes); // Register Sud routes

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});