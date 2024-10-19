import express from 'express';
import {
    uploadSudData,
    getAvailableSudMonthsYears,
    getSudCompositionData,
    getSudEnvironmentalParams,
    getSudSpeciesResult,
    getSudBiostatData,
    getSudSpeciesOptions,
    getSudMaturityDataBySpecies,
    getSudSpeciesByMonthYear,
    deleteDataByMonthAndYear

} from '../controllers/AtlantiqueSudController.js';
import multer from 'multer';

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
});

const AtlantiqueSudRoutes = express.Router();

AtlantiqueSudRoutes.post('/upload', upload.single('file'), uploadSudData);
AtlantiqueSudRoutes.get('/available-months-years', getAvailableSudMonthsYears);
AtlantiqueSudRoutes.get('/composition', getSudCompositionData);
AtlantiqueSudRoutes.get('/environmental-params', getSudEnvironmentalParams);
AtlantiqueSudRoutes.get('/species-result', getSudSpeciesResult);
AtlantiqueSudRoutes.get('/biostat-data', getSudBiostatData);
AtlantiqueSudRoutes.get('/species-options', getSudSpeciesOptions);
AtlantiqueSudRoutes.get('/maturity-data', getSudMaturityDataBySpecies);
AtlantiqueSudRoutes.get('/species-by-month-year', getSudSpeciesByMonthYear);
AtlantiqueSudRoutes.delete('/delete-data', deleteDataByMonthAndYear);  // New route for deletion


export default AtlantiqueSudRoutes;
