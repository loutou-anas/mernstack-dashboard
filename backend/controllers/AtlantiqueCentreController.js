import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import CentreSpeciesDataModel from '../models/CentreSpeciesData.js'; // Model for Atlantique Centre
import SudSpeciesDataModel from '../models/SudSpeciesData.js'; // Model for Atlantique Sud

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const requiredColumns = ['ESPECE', 'TAILLE', 'PDS', 'NB', 'MAT', 'SEX'];

export const uploadCentreData = async (req, res) => {
    try {
        const { month, year } = req.body;
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

        const headers = data[0];
        const isValid = requiredColumns.every(column => headers.includes(column));

        if (!isValid) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ message: 'Invalid Excel file format' });
        }

        // Clear existing data for the same month and year
        await CentreSpeciesDataModel.deleteMany({ month, year });

        // Prepare data for insertion
        const rows = data.slice(1).map(row => ({
            ESPECE: row[headers.indexOf('ESPECE')],
            TAILLE: row[headers.indexOf('TAILLE')],
            PDS: row[headers.indexOf('PDS')],
            NB: row[headers.indexOf('NB')],
            MAT: row[headers.indexOf('MAT')],
            SEX: row[headers.indexOf('SEX')],
            month,
            year
        }));

        // Insert new data
        await CentreSpeciesDataModel.insertMany(rows);

        // Delete the file after processing
        fs.unlinkSync(filePath);

        return res.status(200).json({ message: 'Data uploaded successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};


export const deleteDataByMonthAndYear = async (req, res) => {
    try {
        const { month, year } = req.query; // Use req.query instead of req.body

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        // Delete data from the database
        const deleteResult = await CentreSpeciesDataModel.deleteMany({ month, year });

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

// The same logic applies for `uploadSudData` just replace `CentreSpeciesDataModel` with `SudSpeciesDataModel`


export const getAvailableCentreMonthsYears = async (req, res) => {
    try {
        const { month, year } = req.query;

        let matchCondition = {};
        if (month) {
            matchCondition.month = parseInt(month);
        }
        if (year) {
            matchCondition.year = parseInt(year);
        }

        const monthsYears = await CentreSpeciesDataModel.aggregate([
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

export const getCentreCompositionData = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const compositionData = await CentreSpeciesDataModel.aggregate([
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

export const getCentreEnvironmentalParams = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const environmentalParams = await CentreSpeciesDataModel.aggregate([
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

export const getCentreSpeciesResult = async (req, res) => {
    try {
        const { species, month, year } = req.query;

        if (!species || !month || !year) {
            return res.status(400).json({ message: 'Species, month, and year are required' });
        }

        const speciesResult = await CentreSpeciesDataModel.aggregate([
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

export const getCentreBiostatData = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const biostatData = await CentreSpeciesDataModel.find({ month, year });
        res.status(200).json(biostatData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getCentreSpeciesOptions = async (req, res) => {
    try {
        const speciesOptions = await CentreSpeciesDataModel.distinct('ESPECE');
        res.status(200).json(speciesOptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getCentreMaturityDataBySpecies = async (req, res) => {
    try {
        const speciesName = req.query.species;

        const maturityData = await CentreSpeciesDataModel.aggregate([
            { $match: { ESPECE: speciesName } },
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
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCentreSpeciesByMonthYear = async (req, res) => {
    try {
        const { month, year } = req.query;

        if (!month || !year) {
            return res.status(400).json({ message: 'Month and year are required' });
        }

        const species = await CentreSpeciesDataModel.distinct('ESPECE', { month: parseInt(month), year: parseInt(year) });

        res.status(200).json(species);
    } catch (error) {
        console.error("Error fetching species by month/year:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};