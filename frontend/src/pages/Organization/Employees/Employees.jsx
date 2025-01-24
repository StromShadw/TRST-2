import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
import { RiDeleteBin6Line } from "react-icons/ri";
import { CiEdit } from "react-icons/ci";
import { FaSync } from "react-icons/fa";
import "./Employees.css";
import axios from "axios";

function Employees() {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolOpen, setIsToolOpen] = useState(false);
  const [isColumnOpen, setIsColumnOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleToolDropDown = () => {
    setIsToolOpen(!isToolOpen);
  };
  const ColumnDropDown = () => {
    setIsColumnOpen(!isColumnOpen);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/employees/all",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched employees data:', data); // Log the data

      if (Array.isArray(data.data.employees)) {
        setEmployees(data.data.employees); // Set the employees state
      } else {
        console.error("Expected an array but got:", data.data.employees);
        setEmployees([]); // Reset to empty array if not valid
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };
  console.log("Employees state:", employees); // Log the employees state

  const handleEdit = (employeeId) => {
    navigate(`/edit-employee/${employeeId}`);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm(`Are you sure you want to delete this employee?`)) {
      try {
        await fetch(`http://localhost:8000/api/v1/employees/${employeeId}`, {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        loadEmployees(); // Refresh the list after deletion
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => {
      if (id === "all") {
        return prev.length === employees.length
          ? []
          : employees.map((employee) => employee._id);
      }
      return prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
    });
  };

  const handleBulkDelete = async () => {
    if (checkedItems.length === 0) return;

    if (
      window.confirm(
        `Are you sure you want to delete ${checkedItems.length} selected item(s)?`
      )
    ) {
      try {
        // Delete all checked items
        await Promise.all(
          checkedItems.map((id) =>
            axios.delete(`http://localhost:8000/api/v1/employees/${id}`, {
              headers: {
                "Content-Type": "application/json",
              },
              withCredentials: true,
            })
          )
        );

        // Clear checked items and refresh the list
        setCheckedItems([]);
        loadEmployees(); // Refresh the employee list
      } catch (error) {
        console.error("Error deleting employees:", error);
      }
    }
  };

  const handleRefresh = () => {
    loadEmployees();
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>Employees Page | TRST</title>
        <meta name="description" content="This is the home page description" />
        <meta name="keywords" content="home, react, meta tags" />
      </Helmet>
      <div className="page-content">
        <div className="maincontent">
          <div className="main-content1">
            <div className="d-flex align-items-center justify-content-between">
              <div className="header-text">Employees</div>
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
          <div className="main-content2 pt-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span className="header-title">Business Entity List </span>
                <div className="dropdown">
                  <button
                    className="btn btn-secondary dropdown-toggle border-radius-2"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded={isOpen}
                    onClick={toggleDropdown}
                  >
                    All Employees <IoMdArrowDropdown className="hw-20" />
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
                        <TiPlus
                          style={{
                            width: "15px",
                            height: "15px",
                            marginBottom: "2px",
                          }}
                        />
                        Create New View
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        <IoMdArrowDropright className="hw-20" />
                        All Employees{" "}
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
                      </a>
                    </li>
                    <span className="ms-1">Select Another View...</span>
                    <li>
                      <a className="dropdown-item" href="#">
                        All Active Employees
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Employees with Location
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Terminated Employees
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Portal Users
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Employee Contact Details
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Exercise Portal Users
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Notification Recipients
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Export Only
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Data Migration
                      </a>
                    </li>
                  </ul>
                </div>
                <button className="button border-1 ms-1">
                  <FaHome className="hw-15" />
                </button>
                <button
                  className="button border-1 ms-1"
                  onClick={handleRefresh}
                  disabled={loading}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {loading ? <FaSync className="spinner" /> : <FaSync />}
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
                        ID{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" /> Employee{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        First Name
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Last Name
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Employee ID
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Work Email Address{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Home Phone Number
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Work Mobile Number{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Work Phone{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Personal Mobile Phone{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Department{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Portal User
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Portal Login Name
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Updated At{" "}
                      </label>
                    </li>
                    <li class="dropdown-checkbox">
                      <label>
                        <input type="checkbox" className="ms-2 me-1" />
                        Updated By
                      </label>
                    </li>
                  </ul>
                </span>
                <button className="button border-1 ms-1">
                  <FaFilter className="hw-15" />
                </button>
              </div>
              <div>
                <NavLink className="button1 border-1" to="/new-employee">
                  <TiPlus className="hw-20" />
                  Employees
                </NavLink>
                <button
                  className="button border-1 ms-1"
                  style={{
                    opacity: checkedItems.length > 0 ? 1 : 0.5,
                    cursor: checkedItems.length > 0 ? "pointer" : "default",
                  }}
                  onClick={handleBulkDelete}
                  disabled={checkedItems.length === 0}
                >
                  <FaRegTrashCan className="hw-20" />
                </button>
                <button className="button border-1 ms-1">
                  <TiExport className="hw-20" />
                </button>
                <button className="button border-1 ms-1">
                  <HiDotsHorizontal className="hw-20" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-1 mb-2 mt-2"></div>

        <div className="table-responsive">
          {loading && <div>Loading...</div>}
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    onChange={() => handleCheckboxChange("all")}
                    checked={
                      checkedItems.length === employees.length &&
                      employees.length > 0
                    }
                  />
                </th>
                <th>Actions</th>
                <th>ID</th>
                <th>Employee</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Employee ID</th>
                <th>Work Email Address</th>
                <th>Home Phone Number</th>
                <th>Work Mobile Phone</th>
                <th>Work Phone</th>
                <th>Personal Mobile Phone</th>
                <th>Department</th>
                <th>Portal User</th>
                <th>Portal Login Name</th>
                <th>Updated At</th>
                <th>Updated By</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(employees) &&
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedItems.includes(employee._id)}
                        onChange={() => handleCheckboxChange(employee._id)}
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <CiEdit
                          style={{ cursor: "pointer", color: "green" }}
                          title="Edit"
                          onClick={() => handleEdit(employee._id)}
                        />
                        <RiDeleteBin6Line
                          style={{ cursor: "pointer", color: "red" }}
                          title="Delete"
                          onClick={() => handleDelete(employee._id)}
                        />
                      </div>
                    </td>
                    <td>{employee._id}</td>
                    <td>{`${employee.firstName} ${
                      employee.lastName
                    }`}</td>
                    <td>{employee.firstName || "-"}</td>
                    <td>{employee.lastName || "-"}</td>
                    <td>{employee.employeeID || "-"}</td>
                    <td>{employee.workEmailAddress || "-"}</td>
                    <td>{employee.homePhone || "-"}</td>
                    <td>{employee.workMobile || "-"}</td>
                    <td>{employee.workPhone || "-"}</td>
                    <td>{employee.personalMobile || "-"}</td>
                    <td>{employee.departmentNames?.join(", ") || "-"}</td>
                    <td>
                      {employee.portalUser ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>{employee.portalLoginName || "-"}</td>
                    <td>{new Date(employee.updatedAt).toLocaleString()}</td>
                    <td>
                      {employee.updatedBy?.fullName || "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Employees;
