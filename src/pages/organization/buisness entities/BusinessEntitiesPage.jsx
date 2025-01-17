import { useState } from "react";
import { Helmet } from "react-helmet";
import { AiFillTool } from "react-icons/ai";
import { MdArrowDropDown } from "react-icons/md";
import { FaHome, FaFilter } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { BiColumns } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";
import { TiExport, TiPlus } from "react-icons/ti";
import { HiDotsHorizontal } from "react-icons/hi";
import "./BusinessEntitiesPage.css";

const BusinessEntitiesPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Helmet>
        <title>Business Entities Page | TRST</title>
        <meta name="description" content="This is the home page description" />
        <meta name="keywords" content="home, react, meta tags" />
      </Helmet>
      <div class="container-fluid">
        <div class="main-content1">
          <div class="d-flex align-items-center justify-content-between">
            <div class="header-text">Business Entities</div>
            <div
              class="map-action k-widget k-button-group order-1"
              id="map-action-toggle"
              data-role="buttongroup"
              role="group"
              tabindex="0"
            >
              <span
                aria-pressed="true"
                role="button"
                class="k-button k-state-active"
              >
                Map
              </span>
              <span aria-pressed="false" role="button" class="k-button">
                List
              </span>
              <span class="k-button ms-1 button-order">
                <AiFillTool />
              </span>
            </div>
          </div>
        </div>
        <div class="main-content2 pt-3">
          <div class="d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center">
              <div>
                <span class="header-title">Business Entity List </span>
                <button
                  class="button position-relative border-1"
                  onClick={toggleDropdown}
                >
                  All Business Entities <MdArrowDropDown />
                </button>
                {/* Dropdown Menu */}
                {isOpen && (
                  <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md">
                    <ul className="py-1 text-dark">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Option 1
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Option 2
                      </li>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Option 3
                      </li>
                    </ul>
                  </div>
                )}
              
              <button class="button border-1 ms-1">
                <FaHome />
              </button>
              <button class="button border-1  ms-1">
                <LuRefreshCw />
              </button>
              <button class="button border-1 ms-1">
                <BiColumns />
              </button>
              <button class="button border-1 ms-1">
                <FaFilter />
              </button>
            </div>
            </div>
            <div>
              <button class="button1 border-1">
                <TiPlus />
                Business Entity
              </button>
              <button class="button border-1  ms-1">
                <FaRegTrashCan />
              </button>
              <button class="button border-1  ms-1">
                <TiExport />
              </button>
              <button class="button border-1  ms-1">
                <HiDotsHorizontal />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessEntitiesPage;
