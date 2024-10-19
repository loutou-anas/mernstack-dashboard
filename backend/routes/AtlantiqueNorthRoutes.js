import express from 'express';
import {
    uploadNorthData,
    getAvailableNorthMonthsYears,
    getNorthCompositionData,
    getNorthEnvironmentalParams,
    getNorthSpeciesResult,
    getNorthBiostatData,
    getNorthSpeciesOptions,
    getNorthMaturityDataBySpecies,
    getNorthSpeciesByMonthYear,
    deleteDataByMonthAndYear

} from '../controllers/AtlantiqueNorthController.js';
import multer from 'multer';

const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 }, // Optional: Limit file size to 10MB
});

const AtlantiqueNorthRoutes = express.Router();

AtlantiqueNorthRoutes.post('/upload', upload.single('file'), uploadNorthData);
AtlantiqueNorthRoutes.get('/available-months-years', getAvailableNorthMonthsYears);
AtlantiqueNorthRoutes.get('/composition', getNorthCompositionData);
AtlantiqueNorthRoutes.get('/environmental-params', getNorthEnvironmentalParams);
AtlantiqueNorthRoutes.get('/species-result', getNorthSpeciesResult);
AtlantiqueNorthRoutes.get('/biostat-data', getNorthBiostatData);
AtlantiqueNorthRoutes.get('/species-options', getNorthSpeciesOptions);
AtlantiqueNorthRoutes.get('/maturity-data', getNorthMaturityDataBySpecies);
AtlantiqueNorthRoutes.get('/species-by-month-year', getNorthSpeciesByMonthYear);
AtlantiqueNorthRoutes.delete('/delete-data', deleteDataByMonthAndYear);  // New route for deletion


export default AtlantiqueNorthRoutes;