import PropTypes from "prop-types";
import React from "react";
// import { setActiveSort } from "../../helpers/product";

const ShopSize = ({ string, sizes, getSortParams }) => {
  return (
    <div className="sidebar-widget">
      {/* <h4 className="pro-sidebar-title"><b>{string["Size"]}</b></h4> */}
      <div className="sidebar-widget-list">
        {sizes.length > 0 ? (
          <ul>
            {sizes.map((size, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <label>
                      <input
                        type="checkbox"
                        value={size.value}
                        name="size"
                        // checked={checkedOrNot(singleSize)}
                        onChange={() => {
                          getSortParams("size", size.value);
                        }}
                      />
                      <span className="checkmark" />{size.name}{" "}
                    </label>
                    {/* <button
                      className="text-uppercase"
                      onClick={e => {
                        getSortParams("optionValues", size.value);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" />
                      {size.name}{" "}
                    </button> */}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
            "No sizes found"
          )}
      </div>
    </div>
  );
};

ShopSize.propTypes = {
  getSortParams: PropTypes.func,
  sizes: PropTypes.array
};

export default ShopSize;
