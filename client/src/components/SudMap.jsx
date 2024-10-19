import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix icon issues with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const SudMap = () => {
    // Coordinates for the Southern zone, centered to show Laayoune, Boujdour, and Dakhla
    const position = [25.0, -13.0]; // Adjusted center for southern Morocco

    return (
        <MapContainer center={position} zoom={7} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marker for Laayoune */}
            <Marker position={[27.1253, -13.1625]}>
                <Popup>
                    Laayoune
                </Popup>
            </Marker>
            {/* Marker for Boujdour */}
            <Marker position={[26.1300, -14.5000]}>
                <Popup>
                    Boujdour
                </Popup>
            </Marker>
            {/* Marker for Dakhla */}
            <Marker position={[23.6847, -15.9570]}>
                <Popup>
                    Dakhla
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default SudMap;
