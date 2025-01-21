import React, { useState } from "react";
import { Helmet } from "react-helmet"; //head Customization
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";

//icons
import { HiMiniWrench } from "react-icons/hi2";
import { FaHome, FaFilter, FaRegFilePdf } from "react-icons/fa";
import { FaPrint } from "react-icons/fa6";
import { LuRefreshCw, LuTableOfContents, LuClock9 } from "react-icons/lu";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import { BiExport, BiSolidEdit } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { FaRegTrashCan, FaTableColumns, FaKey } from "react-icons/fa6";
import { TiExport, TiPlus } from "react-icons/ti";
import { HiDotsHorizontal } from "react-icons/hi";
import { ImCopy } from "react-icons/im";
import { SlSizeFullscreen } from "react-icons/sl";

//style
import "./OrganizationalEntitiesPage.css";

const OrganizationalEntitiesPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [viewMode, setViewMode] = useState("map");
  const [selectedValue, setSelectedValue] = useState("50%");

  const options = ["Fit", "50%", "75%", "100%", "125%", "150%", "200%"];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleToolDropDown = () => {
    setIsToolOpen(!isToolOpen);
  };
  const ColumnDropDown = () => {
    setIsColumnOpen(!isColumnOpen);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Organizational Entities Page | TRST</title>
        <meta name="description" content="This is the home page description" />
        <meta name="keywords" content="home, react, meta tags" />
      </Helmet>
      <div className="page-content">
        <div className="main-content1">
          <div className="d-flex align-items-center justify-content-between">
            <div className="header-text">Organizational Entities</div>
            <div
              className="map-action k-widget k-button-group order-1"
              id="map-action-toggle"
              data-role="buttongroup"
              role="group"
            >
              <span
                aria-pressed={viewMode === "map"}
                role="button"
                className={`k-button ${
                  viewMode === "map" ? "k-state-active" : ""
                }`}
                onClick={() => handleViewModeChange("map")}
              >
                Map
              </span>
              <span
                aria-pressed={viewMode === "list"}
                role="button"
                className={`k-button ${
                  viewMode === "list" ? "k-state-active" : ""
                }`}
                onClick={() => handleViewModeChange("list")}
              >
                List
              </span>

              <span className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle border-radius-2 ms-1"
                  type="button"
                  id="TollFropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded={isToolOpen}
                  onClick={toggleToolDropDown}
                >
                  <HiMiniWrench style={{ width: "16px", height: "16px" }} />
                </button>
                <ul
                  className={`dropdown-menu right-auto ${
                    isToolOpen ? "show" : ""
                  }`}
                  aria-labelledby="TollFropdown"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      <BiSolidEdit
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      Design this page
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FcSettings
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      Object Definition
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <LuTableOfContents
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      tab Definition
                    </a>
                  </li>
                  <div className="border-1"></div>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaPrint
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      Print
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaRegFilePdf
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      PDF
                    </a>
                    <div className="border-1"></div>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <LuClock9
                        style={{
                          width: "15px",
                          height: "15px",
                          marginRight: "5px",
                        }}
                      />
                      Page Load Time
                    </a>
                  </li>
                </ul>
              </span>
            </div>
          </div>
        </div>
        {viewMode === "map" ? (
          <div className="main-content2 pt-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="header-title">Hierarchy</span>
              </div>
              <div className="d-flex">
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle border-radius-2"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded={isOpen}
                    onClick={toggleDropdown}
                  >
                    <span>{selectedValue}</span>
                    <span>
                      <IoMdArrowDropdown
                        style={{ width: "20px", height: "20px" }}
                      />
                    </span>
                  </button>
                  <ul
                    className={`dropdown-menu size-dropdown ${isOpen ? "show" : ""}`}
                    aria-labelledby="dropdownMenuButton"
                    style={{
                      "--vz-dropdown-min-width": "15rem",
                      "--vz-dropdown-font-size": "14px;",
                    }}
                  >
                    {options.map((option) => (
                      <li
                        key={option}
                        className="px-3 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelect(option)}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="button border-1 ms-1" title="Key values">
                  <FaKey style={{ width: "18px", height: "18px" }} />
                </button>
                <button className="button border-1 ms-1" title="Export">
                  <BiExport style={{ width: "20px", height: "20px" }} />
                </button>
                <button className="button border-1 ms-1" title="Open All Nodes">
                  <SlSizeFullscreen style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="main-content2 pt-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="header-title">
                  Organizational Entity List{" "}
                </span>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle border-radius-2"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded={isOpen}
                    onClick={toggleDropdown}
                  >
                    All Organizational Entities{" "}
                    <IoMdArrowDropdown
                      style={{ width: "20px", height: "20px" }}
                    />
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
                      <NavLink className="dropdown-item">
                        <TiPlus
                          style={{
                            width: "15px",
                            height: "15px",
                            marginBottom: "2px",
                          }}
                        />
                        Create New View
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item">
                        <IoMdArrowDropright
                          style={{ width: "20px", height: "20px" }}
                        />
                        All Organizational Entities{" "}
                        <BiSolidEdit
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "20px",
                          }}
                        />
                        <FaTableColumns
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                          }}
                        />
                        <ImCopy
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "5px",
                          }}
                        />
                      </NavLink>
                    </li>
                    <span className="ms-1">Select Another View...</span>
                    <li>
                      <NavLink className="dropdown-item">
                        Organizational Entity Scorecard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item">
                        Department List
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item">
                        Organizational Units
                      </NavLink>
                    </li>
                    <li>
                      <NavLink className="dropdown-item">
                        Orphaned Organizational Entities
                      </NavLink>
                    </li>
                  </ul>
                </div>

                <button className="button border-1 ms-1">
                  <FaHome style={{ width: "15px", height: "15px" }} />
                </button>
                <button className="button border-1 ms-1">
                  <LuRefreshCw style={{ width: "18px", height: "18px" }} />
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
                    <FaTableColumns style={{ width: "14px", height: "14px" }} />
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
                      <span className="fw-bold">Columns</span>
                      <button className="blue" title="Reset">
                        Reset
                      </button>
                    </li>
                    <li className="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />{" "}
                        Organizational Entity
                      </label>
                    </li>
                    <li className="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />{" "}
                        Organizational Entity Type
                      </label>
                    </li>
                    <li className="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" /> Related
                        Locations
                      </label>
                    </li>
                    <li className="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" /> Parent
                        Organizational Entity
                      </label>
                    </li>
                    <li className="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" /> Updated
                        At
                      </label>
                    </li>
                    <li className="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" /> Child
                        Organizational Entities
                      </label>
                    </li>
                  </ul>
                </span>
                <button className="button border-1 ms-1">
                  <FaFilter style={{ width: "15px", height: "15px" }} />
                </button>
              </div>
              <div>
                <NavLink
                  className="button1 border-1"
                  to="/new-organizational-entities"
                >
                  <TiPlus style={{ width: "20px", height: "20px" }} />{" "}
                  Organizational Entity
                </NavLink>
                <button className="button border-1 ms-1">
                  <FaRegTrashCan style={{ width: "18px", height: "18px" }} />
                </button>
                <button className="button border-1 ms-1">
                  <TiExport style={{ width: "20px", height: "20px" }} />
                </button>
                <button className="button border-1 ms-1">
                  <HiDotsHorizontal style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="border-1 mt-2"></div>
      </div>
    </React.Fragment>
  );
};

export default OrganizationalEntitiesPage;
