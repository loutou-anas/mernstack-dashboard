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

const CentreMap = () => {
    // Coordinates for the Central zone
    const position = [29.0, -10.0]; // Adjusted center to cover Agadir, Tan-Tan, and Guelmim

    return (
        <MapContainer center={position} zoom={7} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marker for Agadir */}
            <Marker position={[30.42, -9.60]}>
                <Popup>
                    Agadir
                </Popup>
            </Marker>
            {/* Marker for Tan-Tan */}
            <Marker position={[28.43, -11.10]}>
                <Popup>
                    Tan-Tan
                </Popup>
            </Marker>
            {/* Marker for Guelmim */}
            <Marker position={[28.98, -10.06]}>
                <Popup>
                    Guelmim
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default CentreMap;
