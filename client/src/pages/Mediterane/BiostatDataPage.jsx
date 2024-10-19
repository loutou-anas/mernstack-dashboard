import "../../components/BiostatDataPage.css"; 
import { useEffect, useState, useCallback } from 'react';
import { get, delet } from '../../services/ApiEndPoint'; // Use 'delet' here
import { toast } from 'react-hot-toast';
import { useSelector } from 'react-redux';

const BiostatDataPage = () => {
    const [biostatData, setBiostatData] = useState([]);
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Biostat - Mediterranean' : 'Biostat - Méditerranée',
        selectMonth: language === 'en' ? 'Select Month:' : 'Sélectionnez le mois:',
        selectYear: language === 'en' ? 'Select Year:' : 'Sélectionnez l\'année:',
        deleteButton: language === 'en' ? 'Delete' : 'Supprimer',
        noDataMessage: language === 'en' ? 'No biostat data available.' : 'Aucune donnée biostat disponible.',
        fetchDataError: language === 'en' ? 'Failed to load biostat data' : 'Échec du chargement des données biostat',
        deleteDataError: language === 'en' ? 'Failed to delete biostat data' : 'Échec de la suppression des données biostat',
        deleteDataSuccess: language === 'en' ? 'Biostat data deleted successfully' : 'Données biostat supprimées avec succès',        saveDataSuccess: language === 'en' ? 'Biostat data saved successfully' : 'Données biostat enregistrées avec succès',
    };

    const fetchBiostatData = useCallback(async () => {
        if (!month || !year) {
            toast.error(labels.fetchDataError);
            return;
        }
        try {
            const params = { month, year };
            const response = await get('/api/dashboard/biostat-data', params);
            setBiostatData(response.data);
        } catch (error) {
            console.error('Error fetching biostat data:', error);
            toast.error(labels.fetchDataError);
        }
    }, [month, year, labels.fetchDataError]);

    const handleDelete = async () => {
        if (!month || !year) {
            toast.error(labels.fetchDataError);
            return;
        }

        if (window.confirm(language === 'en' ? 'Are you sure you want to delete this data?' : 'Êtes-vous sûr de vouloir supprimer ces données?')) {
            try {
                // Send the delete request with month and year as query parameters
                const params = `?month=${month}&year=${year}`;
                await delet(`/api/dashboard/delete-data${params}`);
                toast.success(labels.deleteDataSuccess);
                setBiostatData([]); // Clear the data after deletion
                setMonth('');
                setYear('');
            } catch (error) {
                console.error('Error deleting biostat data:', error);
                toast.error(labels.deleteDataError);
            }
        }
    };

    useEffect(() => {
        if (month && year) {
            fetchBiostatData();
        }
    }, [fetchBiostatData, month, year]);


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
                        placeholder={language === 'en' ? 'Enter year' : 'Entrez l\'année'}
                    />
                </div>

                <button onClick={handleDelete}>{labels.deleteButton}</button>
            </div>

            {biostatData.length > 0 ? (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>{language === 'en' ? 'Species' : 'ESPECE'}</th>
                                <th>{language === 'en' ? 'Size' : 'TAILLE'}</th>
                                <th>{language === 'en' ? 'Weight' : 'PDS'}</th>
                                <th>{language === 'en' ? 'Count' : 'NB'}</th>
                                <th>{language === 'en' ? 'Maturity' : 'MAT'}</th>
                                <th>{language === 'en' ? 'Sex' : 'SEX'}</th>
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

export default BiostatDataPage;
