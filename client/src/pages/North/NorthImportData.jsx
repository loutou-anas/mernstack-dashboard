import { useState } from 'react';
import { post } from '../../services/ApiEndPoint';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const NorthImportData = () => {
    const [file, setFile] = useState(null);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Import File - North Atlantic' : 'Importer Fichier - Atlantique Nord',
        selectMonth: language === 'en' ? 'Select Month:' : 'Sélectionnez le mois:',
        selectYear: language === 'en' ? 'Select Year:' : 'Sélectionnez l\'année:',
        uploadButton: language === 'en' ? 'Upload' : 'Importer',
        errorMessages: {
            selectFile: language === 'en' ? 'Please select a file first.' : 'Veuillez d\'abord sélectionner un fichier.',
            selectMonthYear: language === 'en' ? 'Please select a month and year.' : 'Veuillez sélectionner un mois et une année.',
            invalidFile: language === 'en' ? 'Please select a valid Excel file.' : 'Veuillez sélectionner un fichier Excel valide.',
            uploadFailed: language === 'en'
                ? 'An unexpected error occurred during file upload. Please try again.'
                : 'Une erreur inattendue s\'est produite lors du téléchargement du fichier. Veuillez réessayer.',
        },
        successMessages: {
            uploadSuccess: language === 'en' ? 'File uploaded successfully' : 'Fichier téléchargé avec succès',
        },
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

        if (!validTypes.includes(selectedFile.type)) {
            toast.error(labels.errorMessages.invalidFile);
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error(labels.errorMessages.selectFile);
            return;
        }
        if (!month || !year) {
            toast.error(labels.errorMessages.selectMonthYear);
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('month', month);
        formData.append('year', year);

        try {
            const response = await post('/api/atlantique-North/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.message || labels.successMessages.uploadSuccess);
        } catch (error) {
            console.error("Error during file upload:", error);
            toast.error(labels.errorMessages.uploadFailed);
        }
    };

    return (
        <div>
            <h2>{labels.pageTitle}</h2>

            <div>
                <label htmlFor="month">{labels.selectMonth}</label>
                <select id="month" value={month} onChange={(e) => setMonth(e.target.value)}>
                    <option value="">{language === 'en' ? '--Select Month--' : '--Sélectionnez le mois--'}</option>
                    {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="year">{labels.selectYear}</label>
                <input
                    type="number"
                    id="year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder={labels.selectYear}
                />
            </div>

            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>{labels.uploadButton}</button>
        </div>
    );
};

export default NorthImportData;
