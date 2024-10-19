import MediterraneanMap from '../../components/NordMap';
import { useSelector } from 'react-redux';

const NorthParametresEnvironnementaux = () => {
    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Environmental Parameters - North Atlantic' : 'Paramètres Environnementaux - Atlantique Nord',
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

export default NorthParametresEnvironnementaux;
