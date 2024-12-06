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
import Accordion from 'react-bootstrap/Accordion';
import Card from "react-bootstrap/Card";

const ShopSidebar = ({ string, getCategoryParams, getSortParams, sideSpaceClass, uniqueCategories, uniqueColors, uniqueSizes, uniqueManufacture }) => {
  // const uniqueCategories = getIndividualCategories(products);
  // const uniqueColors = getIndividualColors(products);
  // const uniqueSizes = getProductsIndividualSizes(products);
  // const uniqueTags = getIndividualTags(products);
  // debugger
  return (
    <div className={`sidebar-style ${sideSpaceClass ? sideSpaceClass : ""}`}>
      {/* shop search */}
      {/* <ShopSearch strings={strings} /> */}
      <h4 className="pro-sidebar-title"><b>Filters</b></h4> 
      <Accordion defaultActiveKey="1">
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
      </Accordion>
      {/* filter by categories */}
      {/* {
        uniqueCategories.length > 0 &&
        <ShopCategories string={string} categories={uniqueCategories} getCategoryParams={getCategoryParams} />
      } */}


      {/* filter by manufacture */}
      {/* {
        uniqueManufacture.length > 0 &&
        <ShopManufacture string={string} manufactures={uniqueManufacture} getSortParams={getSortParams} />
      } */}


      {/* filter by color */}
      {/* {
        uniqueColors.length > 0 &&
        <ShopColor string={string} colors={uniqueColors} getSortParams={getSortParams} />
      } */}


      {/* filter by size */}
      {
        uniqueSizes.length > 0 &&
        <ShopSize string={string} sizes={uniqueSizes} getSortParams={getSortParams} />
      }


      {/* filter by tag */}
      {/* <ShopTag tags={uniqueTags} getSortParams={getSortParams} /> */}
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string
};

export default ShopSidebar;
