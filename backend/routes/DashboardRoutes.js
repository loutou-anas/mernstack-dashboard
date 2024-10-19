import express from 'express';
import multer from 'multer';
import { 
    getCompositionData, 
    getEnvironmentalParams, 
    getSpeciesResult, 
    uploadData, 
    getSpeciesOptions, 
    getMaturityDataBySpecies, 
    getBiostatData, 
    getAvailableMonthsYears,
    getSpeciesByMonthYear,
    deleteDataByMonthAndYear // New import
} from '../controllers/DashboardController.js';

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
});

const DashboardRoutes = express.Router();

DashboardRoutes.get('/composition', getCompositionData);
DashboardRoutes.get('/environmental-params', getEnvironmentalParams);
DashboardRoutes.get('/species-result', getSpeciesResult);
DashboardRoutes.post('/upload', upload.single('file'), uploadData);
DashboardRoutes.get('/species-options', getSpeciesOptions);
DashboardRoutes.get('/maturity-data', getMaturityDataBySpecies);
DashboardRoutes.get('/biostat-data', getBiostatData);
DashboardRoutes.get('/available-months-years', getAvailableMonthsYears);
DashboardRoutes.get('/species-by-month-year', getSpeciesByMonthYear);
DashboardRoutes.delete('/delete-data', deleteDataByMonthAndYear);  // New route for deletion

export default DashboardRoutes;
