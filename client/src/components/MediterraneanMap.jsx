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

const MediterraneanMap = () => {
    // Coordinates for the Mediterranean zone
    const position = [35.3, -4]; // Center coordinates closer to the region in Morocco

    return (
        <MapContainer center={position} zoom={8} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marker for Saidia with adjusted coordinates */}
            <Marker position={[35.088, -2.23]}>
                <Popup>
                    Saidia
                </Popup>
            </Marker>
            {/* Marker for Tetouan */}
            <Marker position={[35.57, -5.37]}>
                <Popup>
                    Tetouan
                </Popup>
            </Marker>
            {/* Marker for Al-Hoceima */}
            <Marker position={[35.25, -3.94]}>
                <Popup>
                    Al-Hoceima
                </Popup>
            </Marker>
            {/* Marker for Nador */}
            <Marker position={[35.17, -2.93]}>
                <Popup>
                    Nador
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MediterraneanMap;
