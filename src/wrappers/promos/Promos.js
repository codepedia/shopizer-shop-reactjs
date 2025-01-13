import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import BannerOneSingle from "../../components/promos/PromosSingle.js";
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { connect } from "react-redux";
// import promoData from "../../data/feature-icons/feature-icon-four.json";

const FeatureIcon  = ({ spaceTopClass, spaceBottomClass, defaultStore, currentLanguageCode }) => {
  const [promoData, setPromoData] = useState([]);
  useEffect(() => {
    getPromoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPromoList = async () => {
    // setLoader(true)
    let action = constant.ACTION.PRODUCT_GROUP + 'PROMO_CODE?store=' + defaultStore + '&lang=' + currentLanguageCode;
    try {
      let response = await WebService.get(action);
      if (response) {
        setPromoData(response?.products)
      }
    } catch (error) {
      // setLoader(false)
    }
  }
  return (
    <div
      className={`banner-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className="row">
          {promoData &&
            promoData.map((single, key) => {
              return (
                <BannerOneSingle
                  data={single}
                  key={key}
                  spaceBottomClass="mb-30"
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

FeatureIcon.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

const mapStateToProps = state => {
  return {
    currentLanguageCode: state.multilanguage.currentLanguageCode,
    defaultStore: state.merchantData.defaultStore
  };
};
const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FeatureIcon);
