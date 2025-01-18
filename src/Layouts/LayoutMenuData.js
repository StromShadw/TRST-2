import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
  const history = useNavigate();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isApps, setIsApps] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isBaseUi, setIsBaseUi] = useState(false);
  const [isAdvanceUi, setIsAdvanceUi] = useState(false);
  const [isForms, setIsForms] = useState(false);
  const [isTables, setIsTables] = useState(false);
  const [isCharts, setIsCharts] = useState(false);
  const [isIcons, setIsIcons] = useState(false);
  const [isMaps, setIsMaps] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);
  const [isLanding, setIsLanding] = useState(false);
  const [isVendors, setIsVendors] = useState(false);  // Add this new state
  const [isImport, setIsImport] = useState(false);  // Add this new state
  const [isVendorSettings, setIsVendorSettings] = useState(false);  // Add this new state

  // Apps
  const [isEmail, setEmail] = useState(false);
  const [isSubEmail, setSubEmail] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "Apps") {
      setIsApps(false);
    }
    if (iscurrentState !== "Auth") {
      setIsAuth(false);
    }
    if (iscurrentState !== "Pages") {
      setIsPages(false);
    }
    if (iscurrentState !== "BaseUi") {
      setIsBaseUi(false);
    }
    if (iscurrentState !== "AdvanceUi") {
      setIsAdvanceUi(false);
    }
    if (iscurrentState !== "Forms") {
      setIsForms(false);
    }
    if (iscurrentState !== "Tables") {
      setIsTables(false);
    }
    if (iscurrentState !== "Charts") {
      setIsCharts(false);
    }
    if (iscurrentState !== "Icons") {
      setIsIcons(false);
    }
    if (iscurrentState !== "Maps") {
      setIsMaps(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
    if (iscurrentState === "Widgets") {
      history("/widgets");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState !== "Landing") {
      setIsLanding(false);
    }
    if (iscurrentState !== "Vendors") {
      setIsVendors(false);
    }
    if (iscurrentState !== "VendorSettings") {
      setIsVendorSettings(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isApps,
    isAuth,
    isPages,
    isBaseUi,
    isAdvanceUi,
    isForms,
    isTables,
    isCharts,
    isIcons,
    isMaps,
    isMultiLevel,
    isVendors,
    isVendorSettings
  ]);

  const menuItems = [{
    id: "admin-home",
    label: "Admin Home",
    icon: "ri-dashboard-2-line",
    link: "/admin-home",
    stateVariables: isDashboard,
    click: function (e) {
      if (e.target.getAttribute("data-bs-toggle")) {
        e.preventDefault();
      }
      setIsDashboard(!isDashboard);
      setIscurrentState("Dashboard");
      updateIconSidebar(e);
    },
    subItems: [
      { id: "action-items", label: "Action Items", link: "/action-items", parentId: "admin-home" },
      { id: "bcic-support-portal", label: "BCIC Support Portal", link: "/bcic-support-portal", parentId: "admin-home" },
      { id: "calendar", label: "Calendar", link: "/calendar", parentId: "admin-home" },
      { id: "communication-log", label: "Communication Log", link: "/communication-log", parentId: "admin-home" },
      { id: "manage-users", label: "Manage Users", link: "/manage-users", parentId: "admin-home" },
      { id: "rto", label: "RTO", link: "/rto", parentId: "admin-home" },
      {
        id: "settings",
        label: "Settings",
        link: "/settings",
        parentId: "admin-home",
        isChildItem: true,
        click: function (e) {
          e.preventDefault();
          setEmail(!isEmail);
        },
        stateVariables: isEmail,
        childItems: [
          {
            id: "import",
            label: "Import",
            link: "/import",
            parentId: "settings",
            isChildItem: true,
            stateVariables: isImport,
            click: function (e) {
              e.preventDefault();
              setIsImport(!isImport);
            },
            childItems: [
              { id: "locations", label: "Locations", link: "/locations", parentId: "import" },
              { id: "business-entities", label: "Business Entities", link: "/business-entities1", parentId: "import" },
              { id: "employees", label: "Employees", link: "/employees1", parentId: "import" },
              {
                id: "vendors",
                label: "Vendors",
                link: "/#",
                parentId: "import",
                isChildItem: true,
                stateVariables: isVendorSettings,
                click: function (e) {
                  e.preventDefault();
                  setIsVendorSettings(!isVendorSettings);
                },
                childItems: [
                  { id: "vendor-locations", label: "Vendor Locations", link: "/vendor-locations", parentId: "vendors" },
                  { id: "vendor-contracts", label: "Vendor Contracts", link: "/vendor-contracts", parentId: "vendors" },
                  { id: "vendor-services", label: "Vendor Services", link: "/vendor-services", parentId: "vendors" },
                ],
              },
              { id: "clients", label: "Clients", link: "/clients", parentId: "import" },
              { id: "applications", label: "Applications", link: "/applications", parentId: "import" },
              { id: "hardware", label: "Hardware", link: "/hardware", parentId: "import" },
              { id: "databases", label: "Databases", link: "/databases", parentId: "import" },
            ],
          },
          { id: "action-item-library", label: "Action Item Library", link: "/action-item-library", parentId: "settings" },
          { id: "exercise-objective-library", label: "Exercise Objective Library", link: "/exercise-objective-library", parentId: "settings" },
        ],
      },
    ],
  },
  {
    id: "organization",
    label: "Organization",
    icon: "ri-organization-chart",
    link: "/organization",
    stateVariables: isPages,
    click: function (e) {
      if (e.target.getAttribute("data-bs-toggle")) {
        e.preventDefault();
      }
      setIsPages(!isPages);
      setIscurrentState("Pages");
      updateIconSidebar(e);
    },
    subItems: [
      { id: "business-entities1", label: "Organizational Entities", link: "/organizational-entities", parentId: "organization" },
      { id: "employees1", label: "Employees", link: "/employees", parentId: "organization" },
      { id: "locations1", label: "Locations", link: "/locations", parentId: "organization" },
      { id: "location-map", label: "Location Map", link: "/location-map", parentId: "organization" },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    icon: "ri-user-fill",
    link: "/resources",
    stateVariables: isBaseUi,
    click: function (e) {
      if (e.target.getAttribute("data-bs-toggle")) {
        e.preventDefault();
      }
      setIsBaseUi(!isBaseUi);
      setIscurrentState("BaseUi");
      updateIconSidebar(e);
    },
    subItems: [
      { id: "client", label: "Client", link: "/client", parentId: "resources" },
      { id: "equipment1", label: "Equipment", link: "/equipment", parentId: "resources" },
    ],
  },
  {
    id: "bia",
    label: "BIA",
    icon: "ri-settings-4-fill",
    link: "/bia",
    stateVariables: isAdvanceUi,
    click: function (e) {
      if (e.target.getAttribute("data-bs-toggle")) {
        e.preventDefault();
      }
      setIsAdvanceUi(!isAdvanceUi);
      setIscurrentState("AdvanceUi");
      updateIconSidebar(e);
    },
    subItems: [
      { id: "action-items2", label: "Action Items", link: "/action-items", parentId: "technology" },
      { id: "applications1", label: "Applications", link: "/applications", parentId: "technology" },
      { id: "databases1", label: "Databases", link: "/databases", parentId: "technology" },
    ],
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "ri-dashboard-line",
    link: "/dashboard",
    stateVariables: isCharts,
    click: function (e) {
      if (e.target.getAttribute("data-bs-toggle")) {
        e.preventDefault();
      }
      setIsCharts(!isCharts);
      setIscurrentState("Charts");
      updateIconSidebar(e);
    },
    subItems: [
      { id: "bia-dashboard1", label: "BIA Dashboard", link: "/bia-dashboard", parentId: "dashboard" },
      { id: "incident-dashboard", label: "Incident Dashboard", link: "/incident-dashboard", parentId: "dashboard" },
    ],
  }];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
