import { useEffect, useState, useCallback } from 'react';
import { get, delet } from '../../services/ApiEndPoint';
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const CentreBiostatDataPage = () => {
    const [biostatData, setBiostatData] = useState([]);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Biostat - Central Atlantic' : 'Biostat - Atlantique Centre',
        selectMonth: language === 'en' ? 'Select Month:' : 'Sélectionnez le mois:',
        selectYear: language === 'en' ? 'Select Year:' : 'Sélectionnez l\'année:',
        noDataMessage: language === 'en' ? 'No biostat data available.' : 'Aucune donnée biostat disponible.',
        saveButton: language === 'en' ? 'Save Data' : 'Sauvegarder les données',
        filterButton: language === 'en' ? 'Filter' : 'Filtrer',
        deleteButton: language === 'en' ? 'Delete' : 'Supprimer',
        errorMessages: {
            selectMonthYear: language === 'en' ? 'Please select a month and year.' : 'Veuillez sélectionner un mois et une année.',
            loadFailed: language === 'en' ? 'Failed to load biostat data' : 'Échec du chargement des données biostat',
            deleteFailed: language === 'en' ? 'Failed to delete biostat data' : 'Échec de la suppression des données biostat',
            deleteSuccess: language === 'en' ? 'Biostat data deleted successfully' : 'Données biostat supprimées avec succès',
        },
    };

    const fetchBiostatData = useCallback(async () => {
        if (!month || !year) {
            toast.error(labels.errorMessages.selectMonthYear);
            return;
        }
        try {
            const params = { month, year };
            const response = await get('/api/atlantique-centre/biostat-data', params);
            setBiostatData(response.data);
        } catch (error) {
            console.error('Error fetching biostat data:', error);
            toast.error(labels.errorMessages.loadFailed);
        }
    }, [month, year, labels.errorMessages]);

    useEffect(() => {
        if (month && year) {
            fetchBiostatData();
        }
    }, [fetchBiostatData, month, year]);

    

    const handleDelete = async () => {
        if (!month || !year) {
            toast.error(labels.errorMessages.selectMonthYear);
            return;
        }

        if (window.confirm(language === 'en' ? 'Are you sure you want to delete this data?' : 'Êtes-vous sûr de vouloir supprimer ces données?')) {
            try {
                const params = `?month=${month}&year=${year}`;
                await delet(`/api/atlantique-centre/delete-data${params}`);
                toast.success(labels.errorMessages.deleteSuccess);
                setBiostatData([]); // Clear the data after deletion
                setMonth('');
                setYear('');
            } catch (error) {
                console.error('Error deleting biostat data:', error);
                toast.error(labels.errorMessages.deleteFailed);
            }
        }
    };

    return (
        <div className="biostat-data-container">
            <h2 className="page-title">{labels.pageTitle}</h2>

            <div className="filter-section">
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

                <button className="delete-button" onClick={handleDelete}>{labels.deleteButton}</button>
            </div>

            {biostatData.length > 0 ? (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ESPECE</th>
                                <th>TAILLE</th>
                                <th>PDS</th>
                                <th>NB</th>
                                <th>MAT</th>
                                <th>SEX</th>
                            </tr>
                        </thead>
                        <tbody>
                            {biostatData.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.ESPECE}</td>
                                    <td>{data.TAILLE}</td>
                                    <td>{data.PDS}</td>
                                    <td>{data.NB}</td>
                                    <td>{data.MAT}</td>
                                    <td>{data.SEX}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="no-data-message">{labels.noDataMessage}</p>
            )}
        </div>
    );
};

export default CentreBiostatDataPage;
