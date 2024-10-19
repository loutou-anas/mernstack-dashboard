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

const NordMap = () => {
    // Coordinates for the broader North Atlantic zone, centered around the Moroccan coast
    const position = [34.0, -10.0]; // Adjusted center for a broader view

    return (
        <MapContainer center={position} zoom={7} style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {/* Marker for Casablanca */}
            <Marker position={[33.5731, -7.5898]}>
                <Popup>
                    Casablanca
                </Popup>
            </Marker>
            {/* Marker for Mohammedia */}
            <Marker position={[33.6866, -7.3827]}>
                <Popup>
                    Mohammedia
                </Popup>
            </Marker>
            {/* Marker for Safi */}
            <Marker position={[32.2994, -9.2372]}>
                <Popup>
                    Safi
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default NordMap;
