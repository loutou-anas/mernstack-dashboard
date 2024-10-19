import { useState } from 'react';
import { post } from '../../services/ApiEndPoint';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const ImportData = () => {
    const [file, setFile] = useState(null);
    const [dataType, setDataType] = useState('species');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Import File - Mediterranean' : 'Importer Fichier - Méditerranée',
        selectMonth: language === 'en' ? 'Select Month:' : 'Sélectionnez le mois:',
        selectYear: language === 'en' ? 'Select Year:' : 'Sélectionnez l\'année:',
        selectFile: language === 'en' ? 'Please select a valid Excel file.' : 'Veuillez sélectionner un fichier Excel valide.',
        selectFileFirst: language === 'en' ? 'Please select a file first.' : 'Veuillez d\'abord sélectionner un fichier.',
        importButton: language === 'en' ? 'Import' : 'Importer',
        fileError: language === 'en' ? 'Please select a valid Excel file.' : 'Veuillez sélectionner un fichier Excel valide.',
        uploadSuccess: language === 'en' ? 'File uploaded successfully.' : 'Fichier importé avec succès.',
        uploadError: language === 'en' ? 'Failed to upload file.' : 'Échec du téléchargement du fichier.',
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

        if (!validTypes.includes(selectedFile.type)) {
            toast.error(labels.fileError);
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error(labels.selectFileFirst);
            return;
        }
        if (!month || !year) {
            toast.error(labels.selectFileFirst);
            return;
        }
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('month', month);
        formData.append('year', year);
    
        try {
            const endpoint = dataType === 'species' ? '/api/dashboard/upload' : '/api/dashboard/upload-station';
            const response = await post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(response.data.message || labels.uploadSuccess);
        } catch (error) {
            console.error("Error during file upload:", error);
    
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || labels.uploadError);
            } else {
                toast.error(labels.uploadError);
            }
        }
    };

    return (
        <div>
            <h2>{labels.pageTitle}</h2>
            <select value={dataType} onChange={(e) => setDataType(e.target.value)}>
                <option value="species">{language === 'en' ? 'Species Data (Biostat)' : 'Données d\'espèces (Biostat)'}</option>
            </select>

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
                    placeholder={language === 'en' ? 'Enter year' : 'Entrez l\'année'}
                />
            </div>

            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>{labels.importButton}</button>
        </div>
    );
};

export default ImportData;
