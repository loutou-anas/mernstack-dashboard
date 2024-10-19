import MediterraneanMap from '../../components/CentreMap';
import { useSelector } from 'react-redux';

const CentreParametresEnvironnementaux = () => {
    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Environmental Parameters - Central Atlantic' : 'Paramètres Environnementaux - Atlantique Centre',
    };

    return (
        <div className="environmental-params-container">
            <h2>{labels.pageTitle}</h2>

            <div className="map-container">
                <MediterraneanMap />
            </div>
        </div>
    );
};

export default CentreParametresEnvironnementaux;
