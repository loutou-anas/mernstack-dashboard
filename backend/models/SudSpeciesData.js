import mongoose from 'mongoose';

const SudSpeciesDataSchema = new mongoose.Schema({
    ESPECE: String,
    TAILLE: Number,
    PDS: Number,
    NB: Number,
    MAT: Number,
    SEX: String,
    month: Number, // New field to store the month
    year: Number  // New field to store the year
});

const SudSpeciesDataModel = mongoose.model('SudSpeciesData', SudSpeciesDataSchema);
export default SudSpeciesDataModel;
