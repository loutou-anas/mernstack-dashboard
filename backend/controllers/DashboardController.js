import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import SpeciesDataModel from '../models/SpeciesData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Step 1: Define the required columns for validation
const requiredColumns = ['ESPECE', 'TAILLE', 'PDS', 'NB', 'MAT', 'SEX'];  // Add this line

export const uploadData = async (req, res) => {
    try {
        const { month, year } = req.body;  // Get month and year from the request body
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = path.join(__dirname, '..', 'uploads', file.filename);
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({ message: 'File not found after upload' });
        }

        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

        if (data.length === 0) {
            return res.status(400).json({ message: 'No data found in Excel file' });
        }

        // Validate that the file contains the required columns
        const headers = data[0]; // Get the first row as the header
        const isValid = requiredColumns.every(column => headers.includes(column));

        if (!isValid) {
            fs.unlinkSync(filePath); // Delete the file after checking
            return res.status(400).json({ message: 'Invalid file format. Please upload a valid biostat Excel file.' });
        }

        // Convert the data into JSON format after the header row
        const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Delete existing data for the selected month and year
        await SpeciesDataModel.deleteMany({ month, year });

        // Insert new data with month and year attached
        const dataToSave = jsonData.map(entry => ({ ...entry, month, year }));
        await SpeciesDataModel.insertMany(dataToSave);

        res.status(200).json({ message: 'File uploaded and data stored successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete data and file by month and year
export const deleteDataByMonthAndYear = async (req, res) => {
    try {
        const { month, year } = req.query; // Use req.query instead of req.body

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        // Delete data from the database
        const deleteResult = await SpeciesDataModel.deleteMany({ month, year });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: 'No data found for the specified month and year' });
        }

        // Locate and delete the corresponding file from the uploads folder
        const uploadDir = path.join(__dirname, '..', 'uploads');
        const files = fs.readdirSync(uploadDir);
        const fileToDelete = files.find(file => file.includes(`${month}_${year}`));

        if (fileToDelete) {
            const filePath = path.join(uploadDir, fileToDelete);
            fs.unlinkSync(filePath);
        }

        res.status(200).json({ message: 'Data and associated file deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Rest of your controller code...
export const getAvailableMonthsYears = async (req, res) => {
    try {
        const { month, year } = req.query;

        let matchCondition = {};
        if (month) {
            matchCondition.month = parseInt(month);
        }
        if (year) {
            matchCondition.year = parseInt(year);
        }

        const monthsYears = await SpeciesDataModel.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { month: '$month', year: '$year' }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            }
        ]);

        res.status(200).json(monthsYears);
    } catch (error) {
        console.error("Error fetching months and years:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



export const getCompositionData = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const compositionData = await SpeciesDataModel.aggregate([
            { $match: { month: parseInt(month), year: parseInt(year) } },
            {
                $group: {
                    _id: '$ESPECE',
                    totalWeight: { $sum: { $multiply: ['$NB', '$PDS'] } }
                }
            }
        ]);

        res.status(200).json(compositionData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getEnvironmentalParams = async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const environmentalParams = await SpeciesDataModel.aggregate([
            { $match: { month: parseInt(month), year: parseInt(year) } },
            {
                $group: {
                    _id: '$ESPECE',
                    averageTemperature: { $avg: '$MAT' }
                }
            }
        ]);

        res.status(200).json(environmentalParams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getSpeciesResult = async (req, res) => {
    try {
        const { species, month, year } = req.query;
        
        if (!species || !month || !year) {
            return res.status(400).json({ message: 'Species, month, and year are required' });
        }

        const speciesResult = await SpeciesDataModel.aggregate([
            { $match: { ESPECE: species, month: parseInt(month), year: parseInt(year) } },
            {
                $group: {
                    _id: '$TAILLE',
                    count: { $sum: '$NB' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        const sizeStructure = speciesResult.map(item => item._id);
        const counts = speciesResult.map(item => item.count);

        res.status(200).json({
            sizeStructure,
            counts,
            densityDistribution: [
                { location: 'Zone 1', density: 20 },
                { location: 'Zone 2', density: 35 },
                { location: 'Zone 3', density: 50 }
            ]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


// Existing code...
export const getBiostatData = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const biostatData = await SpeciesDataModel.find({ month, year });
        res.status(200).json(biostatData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getSpeciesOptions = async (req, res) => {
    try {
        // Assuming species options are static or from a collection in your database
        const speciesOptions = await SpeciesDataModel.distinct('ESPECE');  // Get unique species from the SpeciesDataModel collection
        res.status(200).json(speciesOptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getMaturityDataBySpecies = async (req, res) => {
    try {
        const { species, month, year } = req.query;
        
        if (!species || !month || !year) {
            return res.status(400).json({ message: 'Species, month, and year are required' });
        }

        const maturityData = await SpeciesDataModel.aggregate([
            { $match: { ESPECE: species, month: parseInt(month), year: parseInt(year) } },
            {
                $group: {
                    _id: { MAT: "$MAT", SEX: "$SEX" },
                    count: { $sum: "$NB" }
                }
            },
            {
                $group: {
                    _id: "$_id.SEX",
                    maturityStages: {
                        $push: {
                            stage: "$_id.MAT",
                            count: "$count"
                        }
                    }
                }
            }
        ]);

        res.status(200).json(maturityData);
    } catch (error) {
        console.error("Error fetching maturity data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getSpeciesByMonthYear = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const species = await SpeciesDataModel.distinct('ESPECE', { month: parseInt(month), year: parseInt(year) });

        res.status(200).json(species);
    } catch (error) {
        console.error("Error fetching species by month/year:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
