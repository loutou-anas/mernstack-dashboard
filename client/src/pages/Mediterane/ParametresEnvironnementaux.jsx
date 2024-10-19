import MediterraneanMap from '../../components/MediterraneanMap';
import { useSelector } from 'react-redux';

const ParametresEnvironnementaux = () => {
    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Environmental Parameters - Mediterranean' : 'Paramètres Environnementaux - Méditerranée',
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

export default ParametresEnvironnementaux;
