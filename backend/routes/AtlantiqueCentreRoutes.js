import express from 'express';
import {
    uploadCentreData,
    getAvailableCentreMonthsYears,
    getCentreCompositionData,
    getCentreEnvironmentalParams,
    getCentreSpeciesResult,
    getCentreBiostatData,
    getCentreSpeciesOptions,
    getCentreMaturityDataBySpecies,
    getCentreSpeciesByMonthYear,
    deleteDataByMonthAndYear

} from '../controllers/AtlantiqueCentreController.js';
import multer from 'multer';

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
});

const AtlantiqueCentreRoutes = express.Router();

AtlantiqueCentreRoutes.post('/upload', upload.single('file'), uploadCentreData);
AtlantiqueCentreRoutes.get('/available-months-years', getAvailableCentreMonthsYears);
AtlantiqueCentreRoutes.get('/composition', getCentreCompositionData);
AtlantiqueCentreRoutes.get('/environmental-params', getCentreEnvironmentalParams);
AtlantiqueCentreRoutes.get('/species-result', getCentreSpeciesResult);
AtlantiqueCentreRoutes.get('/biostat-data', getCentreBiostatData);
AtlantiqueCentreRoutes.get('/species-options', getCentreSpeciesOptions);
AtlantiqueCentreRoutes.get('/maturity-data', getCentreMaturityDataBySpecies);
AtlantiqueCentreRoutes.get('/species-by-month-year', getCentreSpeciesByMonthYear);
AtlantiqueCentreRoutes.delete('/delete-data', deleteDataByMonthAndYear);  // New route for deletion


export default AtlantiqueCentreRoutes;