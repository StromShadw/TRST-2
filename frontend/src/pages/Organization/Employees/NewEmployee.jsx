import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { HiMiniWrench } from "react-icons/hi2";
import { BiSolidEdit } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { LuTableOfContents, LuClock9 } from "react-icons/lu";
import { FaPrint, FaRegFilePdf } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { BiRefresh } from "react-icons/bi";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import "./Employees.css";
import axios from "axios";

function NewEmployee() {
    const [isToolOpen, setIsToolOpen] = useState(false);
    const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false); // Time Zone dropdown
    const [isStatusOpen, setIsStatusOpen] = useState(false); // Employee Status dropdown
    const [selectedTimeZone, setSelectedTimeZone] = useState('-- Please select --');
    const [selectedStatus, setSelectedStatus] = useState('-- Please select --');
    const [selectedState, setSelectedState] = useState('-- Please select --');
    const [selectedCountry, setSelectedCountry] = useState('-- Please select --');
    const [isStateOpen, setIsStateOpen] = useState(false); // Add missing state toggle
    const [isCountryOpen, setIsCountryOpen] = useState(false); // Add missing state toggle
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const timeZoneOptions = [
        '-- Please select --',
        'GMT - Coordinated Universal Time',
        'GMT - Greenwich Mean Time',
        'GMT - Western European',
        'EST - Eastern Standard Time',
        'CST - Central Standard Time',
        'MST - Mountain Standard Time',
        'PST - Pacific Standard Time'
    ];

    const statusOptions = [
        '-- Please select --',
        'Active',
        'Terminated'
    ];
    const StateOptions = [
        '-- Please select --',
        'Alabama',
        'Alaska',
        'Arizona',
        'Indiana'
    ];
    const CountryOptions = [
        '-- Please select --',
        'United States',
        'Canada',
        'United Kingdom',
        'Australia'
    ];

    // Dropdown toggles
    const toggleToolDropDown = () => setIsToolOpen(!isToolOpen);
    const toggleTimeZoneDropdown = () => setIsTimeZoneOpen(prev => !prev);
    const toggleStatusDropdown = () => setIsStatusOpen(prev => !prev);
    const toggleStateDropdown = () => setIsStateOpen(prev => !prev);
    const toggleCountryDropdown = () => setIsCountryOpen(prev => !prev);

    // Handle selection
    const handleSelectTimeZone = (option) => {
        setSelectedTimeZone(option);
        setIsTimeZoneOpen(false);
    };

    const handleSelectStatus = (option) => {
        setSelectedStatus(option);
        setIsStatusOpen(false);
    };
    const handleSelectState = (option) => {
        setSelectedSate(option);
        setIsStateOpen(false);
    };
    const handleSelectCountry = (option) => {
        setSelectedCountry(option);
        setIsCountryOpen(false);
    };
    
    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        return (
          <div className="pagination d-flex justify-content-center align-items-center">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt; {/* Previous */}
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt; {/* Next */}
            </button>
          </div>
        );
      };

    const fetchBusinessEntities = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:8000/api/v1/organizational-entities/all', {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            setSearchResults((response.data || []).map(entity => ({
                ...entity,
                selected: false
            })));
        } catch (error) {
            console.error('Error fetching business entities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDepartmentSearch = () => {
        setShowModal(true);
        fetchBusinessEntities();
    };

    const handleEntitySelect = (entity) => {
        // Add your logic here to handle the selected entity
        setShowModal(false);
    };
    // Calculate the current items to display
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentEntities = searchResults.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    // Add page change handler
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <React.Fragment>
            <Helmet>
                <title>New Employee Page | TRST</title>
                <meta name="description" content="This is the home page description" />
                <meta name="keywords" content="home, react, meta tags" />
            </Helmet>
            <div className="page-content">
                <div className="main-content1">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="header-text">Employees: New Employee</div>
                        <div className="d-flex align-items-center justify-content-end">
                            <div>
                                <NavLink className="button3 border-1 button3-changes me-1" to="/employees" title="Save">
                                    <RxCross2 className="me-1" style={{ width: "15px", height: "15px" }} />Cancel
                                </NavLink>
                                <NavLink className="button3 border-1 button3-changes me-1" to="#" title="Save">
                                    Save & New
                                </NavLink>
                                <NavLink className="button3 border-1 me-3" to="#" title="Save">
                                    <FaCheck className="me-1" style={{ width: "15px", height: "15px" }} />Save
                                </NavLink>
                            </div>
                            <div className="map-action k-widget k-button-group order-1" id="map-action-toggle" role="group">
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
                                    <ul className={`right-auto dropdown-menu  ${isToolOpen ? "show" : ""}`} aria-labelledby="TollFropdown">
                                        <li><a className="dropdown-item" href="#"><BiSolidEdit style={{ width: "15px", height: "15px" }} /> Design this page</a></li>
                                        <li><a className="dropdown-item" href="#"><FcSettings style={{ width: "15px", height: "15px" }} /> Object Definition</a></li>
                                        <li><a className="dropdown-item" href="#"><LuTableOfContents style={{ width: "15px", height: "15px" }} /> Tab Definition</a></li>
                                        <div className="border-1"></div>
                                        <li><a className="dropdown-item" href="#"><FaPrint style={{ width: "15px", height: "15px" }} /> Print</a></li>
                                        <li><a className="dropdown-item" href="#"><FaRegFilePdf style={{ width: "15px", height: "15px" }} /> PDF</a></li>
                                        <div className="border-1"></div>
                                        <li><a className="dropdown-item" href="#"><LuClock9 style={{ width: "15px", height: "15px" }} /> Page Load Time</a></li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-content">
                    <div className="form-heading">Work Contact Information</div>
                    <div className="border-1"></div>
                    <Form>
                        <div className="row pt-4">
                            <div className="col-6">
                                {['Employee ID', 'First Name', 'Middle Name', 'Last Name', 'Preferred Name', 'Title'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="timezone" className="form-label me-2 fs-15 w-40">Time Zone</Label>
                                    <div className="dropdown-container position-relative flex-grow-1 w-100">
                                        <button
                                            onClick={toggleTimeZoneDropdown}
                                            className="form-control text-start d-flex justify-content-between align-items-center"
                                            type="button"
                                        >
                                            <span>{selectedTimeZone}</span>
                                            <svg className={`ms-2 ${isTimeZoneOpen ? 'rotate-180' : ''}`} style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isTimeZoneOpen && (
                                            <div className="position-absolute w-100 mt-1 bg-white border rounded dropdown-menu1" style={{ zIndex: 1000 }}>
                                                {timeZoneOptions.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSelectTimeZone(option)}
                                                        className="dropdown-item w-100 text-start py-2 px-3"
                                                        type="button"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                {['Work Email Address', 'Work Phone', 'Work Mobile Phone', 'Fax'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                                {['Manager', 'Subordinates'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-4 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                        <button className="p-7 form-button"><IoIosSearch /></button>
                                    </div>
                                ))}
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="employeeStatus" className="form-label me-2 fs-15 w-40">Employee Status</Label>
                                    <div className="dropdown-container position-relative flex-grow-1 w-100">
                                        <button
                                            onClick={toggleStatusDropdown}
                                            className="form-control text-start d-flex justify-content-between align-items-center"
                                            type="button"
                                        >
                                            <span>{selectedStatus}</span>
                                            <svg className={`ms-2 ${isStatusOpen ? 'rotate-180' : ''}`} style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isStatusOpen && (
                                            <div className="position-absolute w-100 mt-1 bg-white border rounded dropdown-menu1" style={{ zIndex: 1000 }}>
                                                {statusOptions.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSelectStatus(option)}
                                                        className="dropdown-item w-100 text-start py-2 px-3"
                                                        type="button"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className="form-content">
                    <div className="form-heading">Organization
                    </div>
                    <div className="border-1"></div>
                    <Form>
                        <div className="row pt-4">
                            <div className="col-6">
                                {['Location'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-4 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" /><button className="p-7 form-button"><IoIosSearch /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="col-6">
                                {['Department'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-4 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                        <button
                                            className="p-7 form-button"
                                            onClick={handleDepartmentSearch}
                                            type="button"
                                        >
                                            <IoIosSearch />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Form>
                </div>

                <div className="form-content">
                    <div className="form-heading">Personal Contact Information          </div>
                    <div className="border-1"></div>
                    <Form>
                        <div className="row pt-4">
                            <div className="col-6">
                                {['Street Address 1', 'Street Address 2', 'City', 'ZIP/Postal Code'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="State/Province" className="form-label me-2 fs-15 w-40">State/Province</Label>
                                    <div className="dropdown-container position-relative flex-grow-1 w-100">
                                        <button
                                            onClick={toggleStateDropdown}
                                            className="form-control text-start d-flex justify-content-between align-items-center"
                                            type="button"
                                        >
                                            <span>{selectedState}</span>
                                            <svg className={`ms-2 ${isStateOpen ? 'rotate-180' : ''}`} style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isStateOpen && (
                                            <div className="position-absolute w-100 mt-1 bg-white border rounded dropdown-menu1" style={{ zIndex: 1000 }}>
                                                {StateOptions.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSelectState(option)}
                                                        className="dropdown-item w-100 text-start py-2 px-3"
                                                        type="button"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="Country" className="form-label me-2 fs-15 w-40">Country</Label>
                                    <div className="dropdown-container position-relative flex-grow-1 w-100">
                                        <button
                                            onClick={toggleCountryDropdown}
                                            className="form-control text-start d-flex justify-content-between align-items-center"
                                            type="button"
                                        >
                                            <span>{selectedCountry}</span>
                                            <svg className={`ms-2 ${isCountryOpen ? 'rotate-180' : ''}`} style={{ width: "12px", height: "12px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isCountryOpen && (
                                            <div className="position-absolute w-100 mt-1 bg-white border rounded dropdown-menu1" style={{ zIndex: 1000 }}>
                                                {CountryOptions.map((option, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSelectCountry(option)}
                                                        className="dropdown-item w-100 text-start py-2 px-3"
                                                        type="button"
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6">
                                {['Home Phone Number', 'Personal Mobile Phone', 'Personal Email Address'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content">
                            <div className="modal-header d-flex justify-content-between align-items-center">
                                <h5 className="modal-title">Select Business Entity</h5>
                                <div className="d-flex gap-2 align-items-center">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => fetchBusinessEntities()}
                                        title="Refresh"
                                    >
                                        <BiRefresh />
                                    </button>
                                    {/* Remove the close button */}
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary"
                                        onClick={() => setShowModal(false)}
                                        title="Close"
                                    >
                                        <RxCross2 />
                                    </button>
                                </div>
                            </div>
                            <div className="modal-body">
                                {loading ? (
                                    <div className="text-center">Loading...</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th>Actions</th>
                                                    <th>Business Entity</th>
                                                    <th>Business Entity Type</th>
                                                    <th>Related Locations</th>
                                                    <th>Parent Business Entity</th>
                                                    <th>Child Business Entities</th>
                                                    <th>Updated At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentEntities.map((entity, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <button
                                                                className="btn btn-sm btn-primary"
                                                                onClick={() => handleEntitySelect(entity)}
                                                            >
                                                                Select
                                                            </button>
                                                        </td>
                                                        <td>{entity.businessEntity}</td>
                                                        <td>{entity.businessEntityType}</td>
                                                        <td>{entity.relatedLocations}</td>
                                                        <td>{entity.parentBusinessEntity?.businessEntity || ''}</td>
                                                        <td>{entity.childBusinessEntities.map(child => child.businessEntity).join(' | ')}</td>
                                                        <td>{new Date(entity.updatedAt).toLocaleString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {/* Pagination Controls */}
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </div>
                            {/* <div className="modal-footer"> */}
                            {/* Remove the close button */}
                            {/* <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button> */}

                            {/* Add the Select button */}
                            {/* <button onClick={handleSelectEntities}>Select</button>
                <button onClick={handleClose}>Close</button> */}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default NewEmployee;
