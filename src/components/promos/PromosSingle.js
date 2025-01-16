import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const PromoSingle = ({ data, spaceBottomClass }) => {
  return (
    <div className="col-lg-4 col-md-4">
      <div
        className={`single-banner ${spaceBottomClass ? spaceBottomClass : ""}`}
      >
        <Link to={process.env.PUBLIC_URL + data.description.friendlyUrl}>
          {data?.image ? <img src={data?.image?.imageUrl} alt="" /> : <img src={data?.image?.imageUrl} alt="" />}
        </Link>
        <div className="banner-content">
          <h3>{data.description.name}</h3>
          <br/>
          <h4>
          <p dangerouslySetInnerHTML={{ __html: data.description.description }} ></p>
          </h4>
          <Link to={process.env.PUBLIC_URL + data.description.friendlyUrl}>
            <i className="fa fa-long-arrow-right" />
          </Link>
        </div>
      </div>
    </div>
  );
};

PromoSingle.propTypes = {
  data: PropTypes.object,
  spaceBottomClass: PropTypes.string
};

export default PromoSingle;
