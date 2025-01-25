import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

// Icons
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { LuTableOfContents, LuClock9 } from "react-icons/lu";
import { FaRegFilePdf } from "react-icons/fa6";
import { HiMiniWrench } from "react-icons/hi2";
import { BiSolidEdit, BiSearchAlt2, BiRefresh } from "react-icons/bi";
import { FcSettings } from "react-icons/fc";
import { FaPrint } from "react-icons/fa6";

import "./OrganizationalEntityForm.css";

// Add this constant at the top of the file after imports
const BUSINESS_ENTITY_TYPES = ['Company', 'Business Unit', 'Division', 'Department'];

// Pagination Component
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

const EditOrganizationalEntityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location; // Get the state passed from the previous component
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [initialValues, setInitialValues] = useState({
    businessEntityType: state?.businessEntityType || "",
    businessEntity: state?.businessEntity || "",
    businessEntityId: state?.businessEntityId || "",
    editors: state?.editors || [],
    description: state?.description || "",
    parentBusinessEntity: state?.parentBusinessEntity || null,
    childBusinessEntities: state?.childBusinessEntities || [],
    relatedLocations: state?.relatedLocations || [],
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [userLoading, setUserLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items to show per page

  useEffect(() => {
    const fetchEntityDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/organizational-entities/${id}`, {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        });

        console.log(response.data); // Log the response to check the structure
        const entityData = response.data.data;

        if (entityData) {
          setInitialValues({
            businessEntityType: entityData.businessEntityType || "",
            businessEntity: entityData.businessEntity || "",
            businessEntityId: entityData.businessEntityId || "",
            editors: entityData.editors || [],
            description: entityData.description || "",
            parentBusinessEntity: entityData.parentBusinessEntity || null,
            childBusinessEntities: entityData.childBusinessEntities || [],
            relatedLocations: entityData.relatedLocations || [],
          });
        } else {
          console.error('No entity data found');
        }
      } catch (error) {
        if (error.response?.status === 401) {
          console.error('Unauthorized access - redirecting to login');
          navigate('/login'); // Redirect to login page
        } else {
          console.error('Failed to fetch entity details', error);
        }
      }
    };

    fetchEntityDetails();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInitialValues({ ...initialValues, [name]: value });
  };

  const handleEditorRemove = (editor) => {
    const newEditors = initialValues.editors.filter(e => e !== editor);
    setInitialValues({ ...initialValues, editors: newEditors });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`http://localhost:8000/api/v1/organizational-entities/${id}`, initialValues);
      Toastify({
        text: "Entity updated successfully!",
        duration: 3000,
        backgroundColor: "#4caf50",
        close: true,
      }).showToast();
      navigate(`/organizational-entities`);
    } catch (error) {
      console.error('Failed to update entity', error);
      Toastify({
        text: "Failed to update entity",
        duration: 3000,
        backgroundColor: "#f44336",
        close: true,
      }).showToast();
    }
  };

  const toggleToolDropDown = () => {
    setIsToolOpen(!isToolOpen);
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

  const openEntityModal = (fieldName) => {
    setCurrentField(fieldName);
    setShowModal(true);
    fetchBusinessEntities();
  };

  const handleEntitySelect = (entity) => {
    if (currentField === 'parentBusinessEntity') {
      setInitialValues({
        ...initialValues,
        parentBusinessEntity: entity.businessEntity,
        childBusinessEntities: initialValues.childBusinessEntities
      });
    } else if (currentField === 'childBusinessEntities') {
      setInitialValues({
        ...initialValues,
        childBusinessEntities: [...new Set([...initialValues.childBusinessEntities, entity.businessEntity])],
        parentBusinessEntity: initialValues.parentBusinessEntity
      });
    }
    setShowModal(false);
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

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/users/all');
      setUsers(response.data.data); // Assuming the response structure
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleUserSelect = (user) => {
    const newEditors = initialValues.editors
      ? [...new Set([...initialValues.editors, user.username])]
      : [user.username];
    setInitialValues({
      ...initialValues,
      editors: newEditors
    });
    setShowUserModal(false);
  };

  const handleUserCheckbox = (userId) => {
    setUsers(users.map(user =>
      user._id === userId
        ? { ...user, selected: !user.selected }
        : user
    ));
  };

  const handleSelectAllUsers = (e) => {
    setUsers(users.map(user => ({ ...user, selected: e.target.checked })));
  };

  const handleSelectEntities = () => {
    const selectedEntities = searchResults.filter(entity => entity.selected);
    setInitialValues({
      ...initialValues,
      parentBusinessEntity: selectedEntities.map(entity => entity.businessEntity),
      childBusinessEntities: selectedEntities.map(entity => entity.businessEntity)
    });
    setShowModal(false);
    // Add your logic here to handle the selected entities
    console.log(selectedEntities); // Example: log the selected entities
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
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);

  return (
    <div className="page-content">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="header-text">Organizational Entity: Edit Entity</h1>
        <div className="d-flex align-items-center">
          <NavLink
            className="btn btn-outline-secondary me-2"
            to="/organizational-entities"
            title="Cancel"
          >
            <RxCross2 className="me-1" />
            Cancel
          </NavLink>
          {/* <button
            type="submit"
            className="btn btn-outline-success"
            disabled={!initialValues.businessEntityType || !initialValues.businessEntity}
          >
            {loading ? "Saving..." : "Save"}
          </button> */}
          {/* <NavLink
            className="btn btn-outline-primary me-2"
            to="#"
            title="Save and New"
          >
            Save & New
          </NavLink>
          <button
            type="submit"
            className="btn btn-outline-success me-2"
            disabled={!initialValues.businessEntityType || !initialValues.businessEntity}
          >
            <FaCheck className="me-1" />
            Save
          </button> */}
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
            <div className="row">
              <div className="col-9">
                <form onSubmit={handleSubmit}>
                  {/* Organizational Entity Information */}
                  <h4 className="mb-3">Organizational Entity Information</h4>
                  <div className="border-1 mb-3"></div>
                  <div className="mb-3 d-flex">
                    <label htmlFor="businessEntityType" className="form-label label w-20">
                      Business Entity Type <span className="text-danger">*</span>
                    </label>
                    <select
                      id="businessEntityType"
                      name="businessEntityType"
                      value={initialValues.businessEntityType}
                      onChange={handleChange}
                      className="form-select1"
                      required
                    >
                      <option value="">-- Please select --</option>
                      {BUSINESS_ENTITY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3 d-flex">
                    <label htmlFor="businessEntity" className="form-label label w-20">
                      Organizational Entity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessEntity"
                      name="businessEntity"
                      value={initialValues.businessEntity}
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
                      Organizational Entity ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessEntityId"
                      name="businessEntityId"
                      value={initialValues.businessEntityId || ""}
                      onChange={handleChange}
                      className="form-control1"
                    />
                  </div>
                  <div className="mb-3 d-flex">
                    <label htmlFor="editors" className="form-label label w-20">
                      Editor(s)
                    </label>
                    <div
                      className="form-control1 d-flex flex-wrap gap-2"
                      style={{
                        minHeight: '38px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        backgroundColor: '#fff'
                      }}
                    >
                      {initialValues.editors.map((editor, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark d-flex align-items-center"
                          style={{
                            padding: '5px 10px !important',
                            margin: '2px !important',
                            border: '1px solid #ddd !important',
                            borderRadius: '3px !important',
                            backgroundColor: '#f8f9fa !important'
                          }}
                        >
                          {editor}
                          <button
                            type="button"
                            className="btn-close ms-2"
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => handleEditorRemove(editor)}
                          ></button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary border-radius-2"
                      onClick={() => {
                        setShowUserModal(true);
                        fetchUsers();
                      }}
                    >
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
                      value={initialValues.description}
                      onChange={handleChange}
                      className="form-control1"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="border-1"></div>

                  {/* Relationships */}
                  <h4 className="mt-4 mb-3">Relationships</h4>
                  <div className="mb-3 d-flex">
                    <label htmlFor="parentBusinessEntity" className="form-label label w-20">
                      Parent Organizational Entity <span className="text-danger">*</span>
                    </label>
                    <div
                      className="form-control1 d-flex flex-wrap gap-2"
                      style={{
                        minHeight: '38px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        backgroundColor: '#fff'
                      }}
                    >
                      {initialValues.parentBusinessEntity && (
                        <span
                          className="badge bg-light text-dark d-flex align-items-center"
                          style={{
                            padding: '5px 10px !important',
                            margin: '2px !important',
                            border: '1px solid #ddd !important',
                            borderRadius: '3px !important'
                          }}
                        >
                          {initialValues.parentBusinessEntity}
                          <button
                            type="button"
                            className="btn-close ms-2"
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => {
                              setInitialValues({
                                ...initialValues,
                                parentBusinessEntity: null
                              });
                            }}
                          ></button>
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary border-radius-2"
                      onClick={() => openEntityModal('parentBusinessEntity')}
                    >
                      <BiSearchAlt2 />
                    </button>
                  </div>
                  <div className="mb-3 d-flex">
                    <label htmlFor="childBusinessEntities" className="form-label label w-20">
                      Child Organizational Entities
                    </label>
                    <div
                      className="form-control1 d-flex flex-wrap gap-2"
                      style={{
                        minHeight: '38px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        padding: '6px 12px',
                        backgroundColor: '#fff'
                      }}
                    >
                      {initialValues.childBusinessEntities.map((entity, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark d-flex align-items-center"
                          style={{
                            padding: '5px 10px !important',
                            margin: '2px !important',
                            border: '1px solid #ddd !important',
                            borderRadius: '3px !important'
                          }}
                        >
                          {entity}
                          <button
                            type="button"
                            className="btn-close ms-2"
                            style={{ fontSize: '0.5rem' }}
                            onClick={() => {
                              const newChildEntities = initialValues.childBusinessEntities.filter(e => e !== entity);
                              setInitialValues({
                                ...initialValues,
                                childBusinessEntities: newChildEntities
                              });
                            }}
                          ></button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary border-radius-2"
                      onClick={() => openEntityModal('childBusinessEntities')}
                    >
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
                      value={initialValues.relatedLocations.join(', ') || ""}
                      onChange={handleChange}
                      className="form-control1"
                    />
                    <button className="btn btn-secondary border-radius-2">
                      <BiSearchAlt2 />
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-end mt-4">
                    {/* <NavLink
                      className="btn btn-outline-secondary me-2"
                      to="/organizational-entities"
                      title="Cancel"
                    >
                      Cancel
                    </NavLink> */}
                    <button
                      type="submit"
                      className="btn btn-outline-success"
                      disabled={!initialValues.businessEntityType || !initialValues.businessEntity}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
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

      {/* Add User Modal */}
      {showUserModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Select Users</h5>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => fetchUsers()}
                    title="Refresh"
                  >
                    <BiRefresh />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowUserModal(false)}
                    title="Close"
                  >
                    <RxCross2 />
                  </button>
                </div>
              </div>
              <div className="modal-body">
                {userLoading ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>
                            <input
                              type="checkbox"
                              onChange={handleSelectAllUsers}
                              checked={users.length > 0 && users.every(user => user.selected)}
                            />
                          </th>
                          <th>User</th>
                          <th>User Role</th>
                          <th>Login Name</th>
                          <th>Last Login Time</th>
                          <th>Employee Record</th>
                          <th>Updated At</th>
                          <th>Updated By</th>
                          <th>Workflow Status</th>
                          <th>ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user._id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={user.selected}
                                onChange={() => handleUserCheckbox(user._id)}
                              />
                            </td>
                            <td>{user.fullName}</td>
                            <td>{user.role}</td>
                            <td>{user.username}</td>
                            <td>{new Date(user.lastLoginAt).toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}</td>
                            <td></td>
                            <td>{new Date(user.updatedAt).toLocaleString('en-US', {
                              month: '2-digit',
                              day: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}</td>
                            <td>{user.updatedBy?.fullName}</td>
                            <td>{user.workflowStatus}</td>
                            <td>{user._id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="text-muted mt-2">
                      1 - {users.length} of {users.length} items
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const selectedUsers = users.filter(user => user.selected);
                    const newEditors = [
                      ...initialValues.editors,
                      ...selectedUsers.map(user => user.fullName)
                    ];
                    setInitialValues({
                      ...initialValues,
                      editors: [...new Set(newEditors)]
                    });
                    setShowUserModal(false);
                    setUsers(users.map(user => ({ ...user, selected: false })));
                  }}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditOrganizationalEntityForm;

