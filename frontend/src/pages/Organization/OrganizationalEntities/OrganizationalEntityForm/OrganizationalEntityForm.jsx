import React, { useState } from "react";
import { NavLink } from "react-router-dom";

// Icons
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { LuTableOfContents, LuClock9 } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { HiMiniWrench } from "react-icons/hi2";
import { BiSolidEdit, BiSearchAlt2 } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { FaPrint } from "react-icons/fa6";

import "./OrganizationalEntityForm.css";

const OrganizationalEntityForm = () => {
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [formData, setFormData] = useState({
    businessEntityType: "",
    businessEntity: "",
    businessEntityId: "",
    editors: "",
    description: "",
    parentEntity: "",
    childEntities: "",
    relatedLocations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const toggleToolDropDown = () => {
    setIsToolOpen(!isToolOpen);
  };

  return (
    <div className="page-content">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="header-text">Organizational Entity: New Entity</h1>
        <div className="d-flex align-items-center">
          <NavLink
            className="btn btn-outline-secondary me-2"
            to="/organizational-entities"
            title="Cancel"
          >
            <RxCross2 className="me-1" />
            Cancel
          </NavLink>
          <NavLink
            className="btn btn-outline-primary me-2"
            to="#"
            title="Save and New"
          >
            Save & New
          </NavLink>
          <NavLink className="btn btn-outline-success me-2" to="#" title="Save">
            <FaCheck className="me-1" />
            Save
          </NavLink>
          {/* Tool Dropdown */}
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="toolDropdown"
              data-bs-toggle="dropdown"
              aria-expanded={isToolOpen}
              onClick={toggleToolDropDown}
            >
              <HiMiniWrench />
            </button>
            <ul
              className={`dropdown-menu right-auto ${isToolOpen ? "show" : ""}`}
              aria-labelledby="toolDropdown"
            >
              <li>
                <a className="dropdown-item" href="#">
                  <BiSolidEdit className="me-2" />
                  Design this page
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <FcSettings className="me-2" />
                  Object Definition
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <LuTableOfContents className="me-2" />
                  Tab Definition
                </a>
              </li>
              <div className="dropdown-divider"></div>
              <li>
                <a className="dropdown-item" href="#">
                  <FaPrint className="me-2" />
                  Print
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <FaRegFilePdf className="me-2" />
                  PDF
                </a>
              </li>
              <div className="dropdown-divider"></div>
              <li>
                <a className="dropdown-item" href="#">
                  <LuClock9 className="me-2" />
                  Page Load Time
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container">
        <div className="card shadow">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Business Entity Information */}
              <h4 className="mb-3">Business Entity Information</h4>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="businessEntityType"
                  className="form-label label w-20"
                >
                  Business Entity Type <span className="text-danger">*</span>
                </label>
                <select
                  id="businessEntityType"
                  name="businessEntityType"
                  value={formData.businessEntityType}
                  onChange={handleChange}
                  className="form-selectl1"
                  required
                >
                  <option value="">-- Please select --</option>
                  <option value="type1">Type 1</option>
                  <option value="type2">Type 2</option>
                </select>
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="businessEntity"
                  className="form-label label w-20"
                >
                  Business Entity <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="businessEntity"
                  name="businessEntity"
                  value={formData.businessEntity}
                  onChange={handleChange}
                  className="form-control1"
                  required
                />
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="businessEntityId"
                  className="form-label label w-20"
                >
                  Business Entity ID
                </label>
                <input
                  type="text"
                  id="businessEntityId"
                  name="businessEntityId"
                  value={formData.businessEntityId}
                  onChange={handleChange}
                  className="form-control1"
                />
              </div>
              <div className="mb-3 d-flex">
                <label htmlFor="editors" className="form-label label w-20">
                  Editor(s)
                </label>
                <input
                  type="text"
                  id="editors"
                  name="editors"
                  value={formData.editors}
                  onChange={handleChange}
                  className="form-control1"
                />
                <button className="btn btn-secondary border-radius-2">
                  <BiSearchAlt2 />
                </button>
              </div>
              <div className="mb-3 d-flex">
                <label htmlFor="description" className="form-label label w-20">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control1"
                  rows="3"
                ></textarea>
              </div>
              <div className="border-1"></div>

              {/* Relationships */}
              <h4 className="mt-4 mb-3">Relationships</h4>
              <div className="mb-3 d-flex">
                <label htmlFor="parentEntity" className="form-label label w-20">
                  Parent Business Entity <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="parentEntity"
                  name="parentEntity"
                  value={formData.parentEntity}
                  onChange={handleChange}
                  className="form-control1"
                  required
                />
                <button className="btn btn-secondary border-radius-2">
                  <BiSearchAlt2 />
                </button>
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="childEntities"
                  className="form-label label w-20"
                >
                  Child Business Entities
                </label>
                <input
                  type="text"
                  id="childEntities"
                  name="childEntities"
                  value={formData.childEntities}
                  onChange={handleChange}
                  className="form-control1"
                />
                <button className="btn btn-secondary border-radius-2">
                  <BiSearchAlt2 />
                </button>
              </div>
              <div className="mb-3 d-flex">
                <label
                  htmlFor="relatedLocations"
                  className="form-label label w-20"
                >
                  Related Locations
                </label>
                <input
                  type="text"
                  id="relatedLocations"
                  name="relatedLocations"
                  value={formData.relatedLocations}
                  onChange={handleChange}
                  className="form-control1"
                />
                <button className="btn btn-secondary border-radius-2">
                  <BiSearchAlt2 />
                </button>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationalEntityForm;
