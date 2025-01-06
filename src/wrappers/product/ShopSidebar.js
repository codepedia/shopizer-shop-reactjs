import PropTypes from "prop-types";
import React from "react";
// import {
//   getIndividualCategories,
//   getIndividualTags,
//   getIndividualColors,
//   getProductsIndividualSizes
// } from "../../helpers/product";
// import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopColor from "../../components/product/ShopColor";
import ShopSize from "../../components/product/ShopSize";
// import ShopTag from "../../components/product/ShopTag";
import ShopManufacture from "../../components/product/ShopManufacture";
// import Accordion from 'react-bootstrap/Accordion';
// import Card from "react-bootstrap/Card";

const ShopSidebar = ({ height, string, getCategoryParams, getSortParams, sideSpaceClass, uniqueCategories, uniqueColors, uniqueSizes, uniqueManufacture, closeFilter }) => {
  // const [minValue, setMinValue] = useState(0);
  // const [maxValue, setMaxValue] = useState(100);
  // const minRange = 0;
  // const maxRange = 100;

  // const handleMinChange = (e) => {
  //   const value = Math.min(Number(e.target.value), maxValue - 1);
  //   setMinValue(value);
  // };

  // const handleMaxChange = (e) => {
  //   const value = Math.max(Number(e.target.value), minValue + 1);
  //   setMaxValue(value);
  // };

  // const uniqueCategories = getIndividualCategories(products);
  // const uniqueColors = getIndividualColors(products);
  // const uniqueSizes = getProductsIndividualSizes(products);
  // const uniqueTags = getIndividualTags(products);
  // debugger
  return (
    <div className={`offcanvas-filter-menu sidebar-style`} style={{ height: height - 80 }}>
      {/* shop search */}
      {/* <ShopSearch strings={strings} /> */}
      <div>
        <h4 className="pro-sidebar-title" style={{ padding: '15px 0px 0px 17px' }}><b>Filters & Sort</b></h4>
        <button
          className="offcanvas-filter-close"
          id="mobile-menu-close-trigger"
          onClick={() => closeFilter()}
        >
          <i className="pe-7s-close"></i>
        </button>
      </div>
      {/* <Accordion defaultActiveKey="1">
        {
          uniqueCategories.length > 0 &&
          <Card className="filter-my-account">
            <Card.Header className="panel-heading">
              <Accordion.Toggle variant="link" eventKey="1">
                <h3 className="panel-title">
                  {string["Categories"]}
                </h3>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <ShopCategories string={string} categories={uniqueCategories} getCategoryParams={getCategoryParams} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        }
        {
          uniqueManufacture.length > 0 &&
          <Card className="filter-my-account">
            <Card.Header className="panel-heading">
              <Accordion.Toggle variant="link" eventKey="2">
                <h3 className="panel-title">
                  {string["Manufactures"]}
                </h3>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <ShopManufacture string={string} manufactures={uniqueManufacture} getSortParams={getSortParams} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        }
        {
          uniqueColors.length > 0 &&
          <Card className="filter-my-account">
            <Card.Header className="panel-heading">
              <Accordion.Toggle variant="link" eventKey="3">
                <h3 className="panel-title">
                  {string["Color"]}
                </h3>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <ShopColor string={string} colors={uniqueColors} getSortParams={getSortParams} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        }
        {
          uniqueSizes.length > 0 &&
          <Card className="filter-my-account">
            <Card.Header className="panel-heading">
              <Accordion.Toggle variant="link" eventKey="4">
                <h3 className="panel-title">
                  {string["Size"]}
                </h3>
              </Accordion.Toggle>
            </Card.Header>
            <Accordion.Collapse eventKey="4">
              <Card.Body>
                <ShopSize string={string} sizes={uniqueSizes} getSortParams={getSortParams} />
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        }
      </Accordion> */}
      {/* <div className="sidebar-widget" style={{ padding: '15px', borderTop: '1px solid lightgrey' }}>
        <h4 className="pro-sidebar-title" style={{ marginBottom: '10px' }}><b>{"Sort"}</b></h4>
        <div className="sidebar-widget-list">
          <select className="filter-select">
            <option value="default">Default</option>
            <option value="priceHighToLow">Price - High to Low</option>
            <option value="priceLowToHigh">Price - Low to High</option>
          </select>
        </div>
      </div> */}
      {/* <div className="sidebar-widget" style={{ padding: '15px', borderTop: '1px solid lightgrey' }}>
        <h4 className="pro-sidebar-title"><b>{"Price"}</b></h4>
        <div className="sidebar-widget-list">
          <div className="slider-container position-relative">
            <div
              className="slider-track"
              style={{
                left: `${((minValue - minRange) / (maxRange - minRange)) * 100}%`,
                right: `${100 - ((maxValue - minRange) / (maxRange - minRange)) * 100}%`,
              }}
            />
            <input
              type="range"
              min={minRange}
              max={maxRange}
              value={minValue}
              onChange={handleMinChange}
              className="range-input"
            />
            <input
              type="range"
              min={minRange}
              max={maxRange}
              value={maxValue}
              onChange={handleMaxChange}
              className="range-input"
            />
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>${minValue}</span>
            <span>${maxValue}</span>
          </div>
        </div>
      </div> */}
      {/* filter by categories */}
      {
        uniqueCategories.length > 0 &&
        <ShopCategories string={string} categories={uniqueCategories} getCategoryParams={getCategoryParams} />
      }


      {/* filter by manufacture */}
      {
        uniqueManufacture.length > 0 &&
        <ShopManufacture string={string} manufactures={uniqueManufacture} getSortParams={getSortParams} />
      }


      {/* filter by color */}
      {
        uniqueColors.length > 0 &&
        <ShopColor string={string} colors={uniqueColors} getSortParams={getSortParams} />
      }


      {/* filter by size */}
      {
        uniqueSizes.length > 0 &&
        <ShopSize string={string} sizes={uniqueSizes} getSortParams={getSortParams} />
      }


      {/* filter by tag */}
      {/* <ShopTag tags={uniqueTags} getSortParams={getSortParams} /> */}
    </div >
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string
};

export default ShopSidebar;
