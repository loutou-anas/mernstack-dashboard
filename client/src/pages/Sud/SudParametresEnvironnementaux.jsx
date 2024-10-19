import MediterraneanMap from '../../components/SudMap';
import { useSelector } from 'react-redux';

const SudParametresEnvironnementaux = () => {
    const language = useSelector((state) => state.user.language);

    const labels = {
        pageTitle: language === 'en' ? 'Environmental Parameters - South Atlantic' : 'Paramètres Environnementaux - Atlantique Sud',
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

export default SudParametresEnvironnementaux;
