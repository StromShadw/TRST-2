import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { HiMiniWrench } from "react-icons/hi2";
import { BiSolidEdit } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { LuTableOfContents, LuClock9 } from "react-icons/lu";
import { FaPrint } from "react-icons/fa6";
import { FaRegFilePdf } from "react-icons/fa";

// Fix default icon issue
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Create a custom icon
const CustomIcon = L.icon({
  iconUrl: require('./image.png'), // Path to your custom icon
  iconSize: [40, 50], // Size of the icon
  iconAnchor: [15, 50], // Anchor point of the icon
  popupAnchor: [0, -40] // Adjusts the popup position
});

function LocationMap() {
  const position = [25.28354, 51.534677];
  const [isOpen, setIsOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleToolDropDown = () => {
    setIsToolOpen(!isToolOpen);
  };

  return (
    <div className="page-content">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="header-text">Location Map</div>
        <div className="map-action k-widget k-button-group" id="map-action-toggle">
          <span className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle border-radius-2 ms-1"
              type="button"
              id="TollFropdown"
              data-bs-toggle="dropdown"
              aria-expanded={isToolOpen}
              onClick={toggleToolDropDown}
            >
              <HiMiniWrench className="wh-16" />
            </button>
            <ul className={`z-index dropdown-menu right-auto ${isToolOpen ? "show" : ""}`}>
              <li>
                <a className="dropdown-item" href="#">
                  <BiSolidEdit className="hw-15 mr-5px" />
                  Design this page
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <FcSettings className="hw-15 mr-5px" />
                  Object Definition
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <LuTableOfContents className="hw-15 mr-5px" />
                  tab Definition
                </a>
              </li>
              <div className="border-1"></div>
              <li>
                <a className="dropdown-item" href="#">
                  <FaPrint className="hw-15 mr-5px" />
                  Print
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <FaRegFilePdf className="hw-15 mr-5px" />
                  PDF
                </a>
                <div className="border-1"></div>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <LuClock9 className="hw-15 mr-5px" />
                  Page Load Time
                </a>
              </li>
            </ul>
          </span>
        </div>
      </div>
      <div className="map-container" style={{
        height: "calc(100vh - 200px)",
        width: "100%",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden"
      }}>
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Street">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Satellite">
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                attribution='&copy; Google Maps'
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Terrain">
              <TileLayer
                url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
                attribution='&copy; Google Maps'
                subdomains={["mt0", "mt1", "mt2", "mt3"]}
              />
            </LayersControl.BaseLayer>

            <Marker position={position} icon={CustomIcon}>
              <Popup className="custom-popup">
                <div className="popup-content">
                  <h5>Head Office</h5>
                  <p>PO Box 559<br />Doha,<br />Corporate Office</p>
                </div>
              </Popup>
            </Marker>

            {/* <Marker position={[25.28454, 51.534677]} icon={CustomIcon}>
              <Popup className="custom-popup">
                <div className="popup-content">
                  <h5>New Location</h5>
                  <p>This is a new marker added to the map.</p>
                </div>
              </Popup>
            </Marker> */}
          </LayersControl>
        </MapContainer>
      </div>
    </div>
  );
}

export default LocationMap;
