import './Sidebar.css';
import { FaHome, FaTachometerAlt, FaUser, FaSignOutAlt, FaChevronDown, FaCog } from 'react-icons/fa'; // Added FaEye for the visibility button
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../redux/AuthSlice';
import { useState } from 'react';
import { post } from '../services/ApiEndPoint';
import PropTypes from 'prop-types';
import logo from '../assets/inrh-maroc-logo-85E4789326-seeklogo.com.png';

const Sidebar = ({ isAdmin = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isCampaignsOpen, setIsCampaignsOpen] = useState(false);
    const [isUsersOpen, setIsUsersOpen] = useState(false);
    const [isImporterOpen, setIsImporterOpen] = useState(false);
    const [isCentreOpen, setIsCentreOpen] = useState(false);
    const [isNorthOpen, setIsNorthOpen] = useState(false);

    const [isSudOpen, setIsSudOpen] = useState(false);

    // Get the selected language from the Redux store
    const language = useSelector((state) => state.user.language);
    
    // Define menu labels based on the selected language
    const labels = {
        home: language === 'en' ? 'Home' : 'Page D\'accueil',
        dashboard: language === 'en' ? 'Dashboard' : 'Tableau De Bord',
        users: language === 'en' ? 'Users' : 'Utilisateurs',
        settings: language === 'en' ? 'Settings' : 'Paramètres',
        logout: language === 'en' ? 'Logout' : 'Déconnexion',
        campaigns: language === 'en' ? 'Campaigns' : 'Campagnes',
        centre: language === 'en' ? 'Central Atlantic' : 'Pélagique Atlantique Centre',
        North: language === 'en' ? 'North Atlantic' : 'Pélagique Atlantique Nord',

        sud: language === 'en' ? 'South Atlantic' : 'Pélagique Atlantique Sud',
        mediterane: language === 'en' ? 'Mediterranean' : 'Pélagique Méditerranée',
        compositionSpecifique: language === 'en' ? 'Specific Composition' : 'Composition Spécifique',
        parametresEnvironnementaux: language === 'en' ? 'Environmental Parameters' : 'Paramètres Environnementaux',
        resultatParEspece: language === 'en' ? 'Result by Selected Species' : 'Résultat par Espèce Sélectionné',
        gestionUtilisateurs: language === 'en' ? 'Manage Users' : 'Gestions Les Utilisateurs',
        ajouterUtilisateurs: language === 'en' ? 'Add Users' : 'Ajouter Utilisateurs',
        importerFichier: language === 'en' ? 'Import File' : 'Importer Fichier',
        biostat: language === 'en' ? 'Biostat' : 'Biostat',
    };

    const handleLogout = async () => {
        try {
            const response = await post('/api/auth/logout');
            if (response.status === 200) {
                dispatch(logOut());
                navigate('/login');
            }
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };

    const renderImporterSubMenu = () => (
        isImporterOpen && (
            <ul className="sub-menu">
                <li><button onClick={() => navigate('/admin/import')}>{labels.importerFichier}</button></li>
                <li><button onClick={() => navigate('/admin/biostat-data')}>{labels.biostat}</button></li>
            </ul>
        )
    );
    
    const renderImporterSubMenuSud = () => (
        isImporterOpen && (
            <ul className="sub-menu">
                <li><button onClick={() => navigate('/admin/sud-import')}>{labels.importerFichier}</button></li>
                <li><button onClick={() => navigate('/admin/sud-biostat-data')}>{labels.biostat}</button></li>
            </ul>
        )
    );
    const renderImporterSubMenuCentre = () => (
        isImporterOpen && (
            <ul className="sub-menu">
                <li><button onClick={() => navigate('/admin/centre-import')}>{labels.importerFichier}</button></li>
                <li><button onClick={() => navigate('/admin/centre-biostat-data')}>{labels.biostat}</button></li>
            </ul>
        )
    );
    const renderImporterSubMenuNorth = () => (
        isImporterOpen && (
            <ul className="sub-menu">
                <li><button onClick={() => navigate('/admin/North-import')}>{labels.importerFichier}</button></li>
                <li><button onClick={() => navigate('/admin/North-biostat-data')}>{labels.biostat}</button></li>
            </ul>
        )
    );

    const renderCampaignSubMenu = () => (
        isCampaignsOpen && (
            <ul className="sub-menu sub-menu-open">
                <li><button className={`${isCampaignsOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/composition-specifique')}>{labels.compositionSpecifique}</button></li>
                <li><button className={`${isCampaignsOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/parametres-environnementaux')}>{labels.parametresEnvironnementaux}</button></li>
                <li><button className={`${isCampaignsOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/resultat-par-espece')}>{labels.resultatParEspece}</button></li>
                {isAdmin && (
                    <li>
                        <button onClick={() => setIsImporterOpen(!isImporterOpen)} className={`${isImporterOpen ? 'button-open' : ''}`}>
                            {labels.importerFichier} <FaChevronDown className={`icon-chevron ${isImporterOpen ? 'open' : ''}`} />
                        </button>
                        {renderImporterSubMenu()}
                    </li>
                )}
            </ul>
        )
    );
    

    const renderCentreSubMenu = () => (
        isCentreOpen && (
            <ul className="sub-menu sub-menu-open">
                <li><button className={`${isCentreOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/centre-composition-specifique')}>{labels.compositionSpecifique}</button></li>
                <li><button className={`${isCentreOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/centre-parametres-environnementaux')}>{labels.parametresEnvironnementaux}</button></li>
                <li><button className={`${isCentreOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/centre-resultat-par-espece')}>{labels.resultatParEspece}</button></li>
                {isAdmin && (
                    <li>
                        <button onClick={() => setIsImporterOpen(!isImporterOpen)} className={`${isImporterOpen ? 'button-open' : ''}`}>
                            {labels.importerFichier} <FaChevronDown className={`icon-chevron ${isImporterOpen ? 'open' : ''}`} />
                        </button>
                        {renderImporterSubMenuCentre()}
                    </li>
                )}
            </ul>
        )
    );
    const renderNorthSubMenu = () => (
        isNorthOpen && (
            <ul className="sub-menu sub-menu-open">
                <li><button className={`${isNorthOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/North-composition-specifique')}>{labels.compositionSpecifique}</button></li>
                <li><button className={`${isNorthOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/North-parametres-environnementaux')}>{labels.parametresEnvironnementaux}</button></li>
                <li><button className={`${isNorthOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/North-resultat-par-espece')}>{labels.resultatParEspece}</button></li>
                {isAdmin && (
                    <li>
                        <button onClick={() => setIsImporterOpen(!isImporterOpen)} className={`${isImporterOpen ? 'button-open' : ''}`}>
                            {labels.importerFichier} <FaChevronDown className={`icon-chevron ${isImporterOpen ? 'open' : ''}`} />
                        </button>
                        {renderImporterSubMenuNorth()}
                    </li>
                )}
            </ul>
        )
    );
    

    const renderSudSubMenu = () => (
        isSudOpen && (
            <ul className="sub-menu sub-menu-open">
                <li><button className={`${isSudOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/sud-composition-specifique')}>{labels.compositionSpecifique}</button></li>
                <li><button className={`${isSudOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/sud-parametres-environnementaux')}>{labels.parametresEnvironnementaux}</button></li>
                <li><button className={`${isSudOpen ? 'button-open' : ''}`} onClick={() => navigate('/dashboard/sud-resultat-par-espece')}>{labels.resultatParEspece}</button></li>
                {isAdmin && (
                    <li>
                        <button onClick={() => setIsImporterOpen(!isImporterOpen)} className={`${isImporterOpen ? 'button-open' : ''}`}>
                            {labels.importerFichier} <FaChevronDown className={`icon-chevron ${isImporterOpen ? 'open' : ''}`} />
                        </button>
                        {renderImporterSubMenuSud()}
                    </li>
                )}
            </ul>
        )
    );    

    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src={logo} alt="Logo" className="logo" />
            </div>
            <h2>{language === 'en' ? 'My Dashboard' : 'Mon Tableau De Bord'}</h2>
            <ul>
                <li>
                    <button onClick={() => navigate('/')}><FaHome className="icon" />{labels.home}</button>
                </li>
                <li>
                    <button onClick={() => setIsDashboardOpen(!isDashboardOpen)}>
                        <FaTachometerAlt className="icon" />{labels.dashboard}<FaChevronDown className={`icon-chevron ${isDashboardOpen ? 'open' : ''}`} />
                    </button>
                    {isDashboardOpen && (
                        <ul className="sub-menu">
                            <li>
                                <button 
                                    onClick={() => {
                                        setIsCampaignsOpen(!isCampaignsOpen);                                        setIsCentreOpen(false);
                                        setIsNorthOpen(false);
                                        setIsSudOpen(false);
                                    }} 
                                    className={`${isCampaignsOpen ? 'button-open' : ''}`}
                                >
                                    {labels.mediterane} <FaChevronDown className={`icon-chevron ${isCampaignsOpen ? 'open' : ''}`} />
                                </button>
                                {renderCampaignSubMenu()}
                            </li>


                            <li>
                                <button 
                                    onClick={() => {
                                        setIsNorthOpen(!isNorthOpen);
                                        setIsCampaignsOpen(false);
                                        setIsCentreOpen(false);
                                        setIsSudOpen(false);
                                    }} 
                                    className={`${isNorthOpen ? 'button-open' : ''}`}
                                >
                                    {labels.North} <FaChevronDown className={`icon-chevron ${isCentreOpen ? 'open' : ''}`} />
                                </button>
                                {renderNorthSubMenu()}
                            </li>

                            

                            <li>
                                <button 
                                    onClick={() => {
                                        setIsCentreOpen(!isCentreOpen);
                                        setIsCampaignsOpen(false);
                                        setIsNorthOpen(false);
                                        setIsSudOpen(false);
                                    }} 
                                    className={`${isCentreOpen ? 'button-open' : ''}`}
                                >
                                    {labels.centre} <FaChevronDown className={`icon-chevron ${isCentreOpen ? 'open' : ''}`} />
                                </button>
                                {renderCentreSubMenu()}
                            </li>


                            <li>
                                <button 
                                    onClick={() => {
                                        setIsSudOpen(!isSudOpen);
                                        setIsCampaignsOpen(false);
                                        setIsNorthOpen(false);
                                        setIsCentreOpen(false);
                                    }} 
                                    className={`${isSudOpen ? 'button-open' : ''}`}
                                >
                                    {labels.sud} <FaChevronDown className={`icon-chevron ${isSudOpen ? 'open' : ''}`} />
                                </button>
                                {renderSudSubMenu()}
                            </li>
                        </ul>
                    )}
                </li>
                {isAdmin && (
                    <li>
                        <button onClick={() => setIsUsersOpen(!isUsersOpen)}>
                            <FaUser className="icon" />{labels.users}<FaChevronDown className={`icon-chevron ${isUsersOpen ? 'open' : ''}`} />
                        </button>
                        {isUsersOpen && (
                            <ul className="sub-menu">
                                <li>
                                    <button onClick={() => navigate('/admin')}>
                                        {labels.gestionUtilisateurs}
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => navigate('/admin/register')}>
                                        {labels.ajouterUtilisateurs}
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                )}
                <li>
                    <button onClick={() => navigate('/settings')}>
                        <FaCog className="icon" /> {labels.settings}
                    </button>
                </li>
                <li>
                    <button onClick={handleLogout}>
                        <FaSignOutAlt className="icon" />{labels.logout}
                    </button>
                </li>
            </ul>
        </div>
    );
};

Sidebar.propTypes = {
    isAdmin: PropTypes.bool,
};

export default Sidebar;
