import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, NavLink } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { HiMiniWrench } from "react-icons/hi2";
import { BiSolidEdit } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { LuRefreshCw, LuTableOfContents, LuClock9 } from "react-icons/lu";
import { FaPrint } from "react-icons/fa6";
import { FaHome, FaFilter, FaRegFilePdf } from "react-icons/fa";
import { TiExport, TiPlus } from "react-icons/ti";
import { FaRegTrashCan, FaTableColumns } from "react-icons/fa6";
import { ImCopy } from "react-icons/im";
import { HiDotsHorizontal } from "react-icons/hi";
import "./Locations.css";

function Locations() {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/locations/all");
        const data = await response.json();
        if (data.success) {
          setLocations(data.data);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleToolDropDown = () => {
    setIsToolOpen(!isToolOpen);
  };
  const ColumnDropDown = () => {
    setIsColumnOpen(!isColumnOpen);
  };

  const handleCheckboxChange = (id) => {
    setSelectedLocations((prev) => 
      prev.includes(id) ? prev.filter((locId) => locId !== id) : [...prev, id]
    );
  };

  const handleActionClick = (action) => {
    if (action === "delete") {
      console.log("Deleting locations:", selectedLocations);
      setSelectedLocations([]);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Location Page | TRST</title>
        <meta name="description" content="This is the home page description" />
        <meta name="keywords" content="home, react, meta tags" />
      </Helmet>
      <div className="page-content">
        <div className="maincontent">
          <div className="main-content1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="header-text">Locations</div>
              <div
                className="map-action k-widget k-button-group order-1"
                id="map-action-toggle"
                data-role="buttongroup"
                role="group"
              >
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
                  <ul
                    className={`right-auto dropdown-menu ${
                      isToolOpen ? "show" : ""
                    }`}
                    aria-labelledby="TollFropdown"
                  >
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
          </div>
          <div className="main-content2 pt-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="header-title">Locations </span>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle border-radius-2"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded={isOpen}
                    onClick={toggleDropdown}
                  >
                    All Locations <IoMdArrowDropdown className="hw-20" />
                  </button>
                  <ul
                    className={`dropdown-menu ${isOpen ? "show" : ""}`}
                    aria-labelledby="dropdownMenuButton"
                    style={{
                      "--vz-dropdown-min-width": "15rem",
                      "--vz-dropdown-font-size": "14px;",
                    }}
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        <TiPlus className="mb-2px hw-15" />
                        Create New View
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <IoMdArrowDropright className="hw-20" />
                        All Locations <BiSolidEdit className="hw-15 ml-20px" />
                        <FaTableColumns className="hw-15 ml-5px" />
                        <ImCopy className="hw-15 ml-5px" />
                      </a>
                    </li>
                    <span className="ms-1">Select Another View...</span>
                    <li>
                      <a className="dropdown-item" href="#">
                        Locations with Addresses
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        All Locations (Longitude/Latitude)
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        For Export Only
                      </a>
                    </li>
                  </ul>
                </div>
                <button className="button border-1 ms-1">
                  <FaHome className="hw-15" />
                </button>
                <button className="button border-1 ms-1">
                  <LuRefreshCw className="hw-18" />
                </button>
                <span className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle border-radius-2 ms-1"
                    type="button"
                    id="TollFropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded={isColumnOpen}
                    onClick={ColumnDropDown}
                  >
                    <FaTableColumns className="hw-14" />
                  </button>
                  <ul
                    className={`dropdown-menu ${isColumnOpen ? "show" : ""}`}
                    aria-labelledby="TollFropdown"
                    style={{
                      "--vz-dropdown-min-width": "15rem",
                      "--vz-dropdown-font-size": "14px;",
                    }}
                  >
                    <li className="align-items-center justify-content-between d-flex me-1 ms-1">
                      <span className="fw-bold">Columns</span>{" "}
                      <a className="blue">Reset</a>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Location Name{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" /> Location
                        Type{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Street Address 1
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Street Address 2
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        City
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        State/Province
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Zip/Postal Code
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Country
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Main Phone
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Employee Count
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Capacity
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Capacity Used(%)
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Latitude
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Longitude
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        ID
                      </label>
                    </li>
                  </ul>
                </span>
                <button className="button border-1 ms-1">
                  <FaFilter className="hw-15" />
                </button>
              </div>
              <div>
                <NavLink className="button1 border-1" to="/new-location">
                  <TiPlus className="hw-20" />
                  Location
                </NavLink>
                <button className="button border-1 ms-1">
                  <FaRegTrashCan className="hw-18" />
                </button>
                <button className="button border-1 ms-1">
                  <TiExport className="hw-20" />
                </button>
                <button className="button border-1 ms-1">
                  <HiDotsHorizontal className="hw-20" />
                </button>
              </div>
            </div>
            <button onClick={() => handleActionClick("delete")} disabled={selectedLocations.length === 0}>
              Delete Selected
            </button>
          </div>
        </div>
        <div className="border-1 mb-2 mt-2"></div>
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedLocations(locations.map(loc => loc._id));
                    } else {
                      setSelectedLocations([]);
                    }
                  }}
                  checked={selectedLocations.length === locations.length}
                />
              </th>
              <th>Actions</th>
              <th>Location Name</th>
              <th>Location Type</th>
              <th>Street Address 1</th>
              <th>City</th>
              <th>State/Province</th>
              <th>Country</th>
              <th>Main Phone</th>
              <th>Capacity</th>
              
            </tr>
          </thead>
          <tbody>
            {locations.map(location => (
              <tr key={location._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(location._id)}
                    onChange={() => handleCheckboxChange(location._id)}
                  />
                </td>
                <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CiEdit
                          style={{ cursor: "pointer", color: "green" }}
                          title="Edit"
                          // onClick={() => handleEdit(employee._id)}
                        />
                        <RiDeleteBin6Line
                          style={{ cursor: "pointer", color: "red" }}
                          title="Delete"
                          // onClick={() => handleDelete(employee._id)}
                        />
                      </div>
                    </td>
                <td>{location.locationName}</td>
                <td>{location.locationType}</td>
                <td>{location.streetAddress1}</td>
                <td>{location.city}</td>
                <td>{location.stateProvince}</td>
                <td>{location.country}</td>
                <td>{location.mainPhone}</td>
                <td>{location.capacity}</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}

export default Locations;
