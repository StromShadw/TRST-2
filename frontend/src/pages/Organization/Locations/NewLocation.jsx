import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// Icons
import { RxCross2 } from "react-icons/rx";
import { LuTableOfContents, LuClock9 } from "react-icons/lu";
import { HiMiniWrench } from "react-icons/hi2";
import { BiSolidEdit } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { FaCheck } from "react-icons/fa";
import { FaPrint, FaRegFilePdf } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { FaCircleQuestion } from "react-icons/fa6";
import { Input, Label, Form, } from 'reactstrap';
import "./Locations.css";

function NewLocation() {
    const [isToolOpen, setIsToolOpen] = useState(false);
    const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false); // Time Zone dropdown
    const [isStatusOpen, setIsStatusOpen] = useState(false); // Employee Status dropdown
    const [selectedTimeZone, setSelectedTimeZone] = useState('-- Please select --');
    const [selectedStatus, setSelectedStatus] = useState('-- Please select --');
    const [selectedState, setSelectedState] = useState('-- Please select --');
    const [selectedCountry, setSelectedCountry] = useState('-- Please select --');
    const [isStateOpen, setIsStateOpen] = useState(false); // Add missing state toggle
    const [isCountryOpen, setIsCountryOpen] = useState(false); // Add missing state toggle
    const [showModal, setShowModal] = useState(false);
    const [selectedBusinessEntities, setSelectedBusinessEntities] = useState([]);

    const timeZoneOptions = [
        '-- Please select --',
        'ATM',
        'Branch',
        'Cold Site',
        'Corporate Office',
    ];

    const statusOptions = [
        '-- Please select --',
        'Leased',
        'Owned'
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

    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentField, setCurrentField] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;


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

    const openEntityModal = (fieldName) => {
        setCurrentField(fieldName);
        setShowModal(true);
        fetchBusinessEntities();
    };

    const handleEntitySelect = (entity) => {
        setSelectedBusinessEntities([...selectedBusinessEntities, entity.businessEntity]);
        setShowModal(false);
    };

    const handleRemoveEntity = (entityToRemove) => {
        setSelectedBusinessEntities(selectedBusinessEntities.filter(
            entity => entity !== entityToRemove
        ));
    };

    const handleEntityCheckbox = (entityId) => {
        setSearchResults(searchResults.map(entity =>
            entity._id === entityId
                ? { ...entity, selected: !entity.selected }
                : entity
        ));
    };

    const handleSelectAllEntities = (e) => {
        setSearchResults(searchResults.map(entity => ({
            ...entity,
            selected: e.target.checked
        })));
    };


    const handleClose = () => {
        setShowModal(false);
    };

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the current items to display
    const indexOfLastEntity = currentPage * itemsPerPage;
    const indexOfFirstEntity = indexOfLastEntity - itemsPerPage;
    const currentEntities = searchResults.slice(indexOfFirstEntity, indexOfLastEntity);

    // Calculate total pages
    const totalPages = Math.ceil(searchResults.length / itemsPerPage)
    return (
        <React.Fragment>
            <Helmet>
                <title>New Location Page | TRST</title>
                <meta name="description" content="This is the home page description" />
                <meta name="keywords" content="home, react, meta tags" />
            </Helmet>
            <div className="page-content">
                <div className="main-content1">
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="header-text">Location: New Location</div>
                        <div className="d-flex align-items-center justify-content-end">
                            <div>
                                <NavLink className="button3 border-1 button3-changes me-1" to="#" title="Save">
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
                                        <HiMiniWrench className="hw-16" />
                                    </button>
                                    <ul className={`right-auto dropdown-menu  ${isToolOpen ? "show" : ""}`} aria-labelledby="TollFropdown">
                                        <li><a className="dropdown-item" href="#"><BiSolidEdit className="hw-15" /> Design this page</a></li>
                                        <li><a className="dropdown-item" href="#"><FcSettings className="hw-15" /> Object Definition</a></li>
                                        <li><a className="dropdown-item" href="#"><LuTableOfContents className="hw-15" /> Tab Definition</a></li>
                                        <div className="border-1"></div>
                                        <li><a className="dropdown-item" href="#"><FaPrint className="hw-15" /> Print</a></li>
                                        <li><a className="dropdown-item" href="#"><FaRegFilePdf className="hw-15" /> PDF</a></li>
                                        <div className="border-1"></div>
                                        <li><a className="dropdown-item" href="#"><LuClock9 className="hw-15" /> Page Load Time</a></li>
                                    </ul>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-content">
                    <div className="form-heading">Location Information</div>
                    <div className="border-1"></div>
                    <Form>
                        <div className="row pt-4">
                            <div className="col-6">
                                {['Location Name', 'Location ID'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="locationType" className="form-label me-2 fs-15 w-40">Location Type  </Label>
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
                                {['Capacity'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                            </div>
                            <div className="col-6">
                                {['Main Phone'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                    </div>
                                ))}
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="siteOwnership" className="form-label me-2 fs-15 w-40">Site Ownership</Label>
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
                                {['Site Manager'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-4 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                        <button className="p-7 form-button"><IoIosSearch /></button>
                                    </div>
                                ))}

                            </div>
                        </div>
                    </Form>
                </div>

                <div className="form-content">
                    <div className="form-heading">Location and Address Information
                    </div>
                    <div className="border-1"></div>
                    <Form>
                        <div className="row pt-4">
                            <div className="col-6">
                                {['Street Address 1', 'Street Address 2', 'City'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" /></div>
                                ))}
                            </div>
                            <div className="col-6">
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
                                {['ZIP/Postal Code'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-2 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" /></div>
                                ))}
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
                        </div>
                    </Form>
                </div>

                <div className="form-content">
                    <div className="form-heading">Relationships </div>
                    <div className="border-1"></div>
                    <Form>
                        <div className="row pt-4">
                            <div className="col-6">
                                {['Parent Location', 'Child Locations'].map((label, index) => (
                                    <div className="mb-3 d-flex align-items-center" key={index}>
                                        <Label htmlFor={label} className="form-label me-4 fs-15 w-40">{label}</Label>
                                        <Input name="text" className="form-control" type="text" />
                                        <button className="p-7 form-button"><IoIosSearch /></button>
                                    </div>
                                ))}


                            </div>
                            <div className="col-6">
                                <div className="mb-3 d-flex align-items-center">
                                    <Label htmlFor="Business Entities" className="form-label me-2 fs-15 w-40">
                                        Business Entities
                                    </Label>
                                    <FaCircleQuestion className="me-2 hw-20" />
                                    <div
                                        className="form-control d-flex flex-wrap gap-2"
                                        style={{
                                            minHeight: '38px',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                            setShowModal(true);
                                            fetchBusinessEntities();
                                        }}
                                    >
                                        {selectedBusinessEntities.map((entity, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-light text-dark d-flex align-items-center"
                                                style={{
                                                    padding: '5px 10px',
                                                    margin: '2px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '3px'
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {entity}
                                                <button
                                                    type="button"
                                                    className="btn-close ms-2"
                                                    style={{ fontSize: '0.5rem' }}
                                                    onClick={() => handleRemoveEntity(entity)}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                    <button 
                                        className="p-7 form-button"
                                        onClick={() => {
                                            setShowModal(true);
                                            fetchBusinessEntities();
                                        }}
                                    >
                                        <IoIosSearch />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Form>
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
            </div>
        </React.Fragment>
    )
}

export default NewLocation