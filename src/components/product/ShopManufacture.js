import PropTypes from "prop-types";
import React from "react";
// import { setActiveSort } from "../../helpers/product";

const ShopManufacture = ({ string, manufactures, getSortParams }) => {
  return (
    <div className="sidebar-widget" style={{ padding: '20px', borderTop: '1px solid lightgrey' }}>
      <h4 className="pro-sidebar-title"><b>{string["Manufactures"]}</b></h4>
      <div className="sidebar-widget-list">
        {manufactures.length > 0 ? (
          <ul>
            {manufactures.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <label>
                      <input
                        type="checkbox"
                        value={category.id}
                        name="manufacture"
                        // checked={checkedOrNot(singleSize)}
                        onChange={() => {
                          getSortParams("manufacturer", category.id);
                        }}
                      />
                      <span className="checkmark" />{category.description.name}{" "}
                    </label>
                    {/* <button
                      onClick={e => {
                        getSortParams("manufacturer", category.id);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" /> {category.description.name}{" "}
                    </button> */}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No manufactures found"
        )}
      </div>
    </div>
  );
};

ShopManufacture.propTypes = {
  categories: PropTypes.array,
  getSortParams: PropTypes.func
};

export default ShopManufacture;
