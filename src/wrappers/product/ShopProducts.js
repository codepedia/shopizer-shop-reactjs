import PropTypes from "prop-types";
import React from "react";
import ProductgridList from "./ProductgridList";

const ShopProducts = ({ products, layout, strings }) => {
  console.log(layout)
  return (
    <div className="shop-bottom-area mt-35">
      <div className={`row ${layout ? layout : ""}`}>
        <ProductgridList products={products} strings={strings} layout={layout} spaceBottomClass="mb-25" />
      </div>
    </div>
  );
};

ShopProducts.propTypes = {
  layout: PropTypes.string,
  products: PropTypes.array
};

export default ShopProducts;
