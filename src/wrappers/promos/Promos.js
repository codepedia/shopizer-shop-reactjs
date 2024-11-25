import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
// import featureIconData from "../../data/feature-icons/feature-icon-four.json";
// import FeatureIconSingle from "../../components/feature-icon/FeatureIconSingle.js";
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { connect } from "react-redux";

const FeatureIcon = ({
  spaceTopClass,
  spaceBottomClass,
  containerClass,
  gutterClass,
  responsiveClass,
  bgImg,
  defaultStore,
  currentLanguageCode
}) => {
  const [promoData, setPromoData] = useState([]);
  useEffect(() => {
    // getBannerImage();
    getPromoList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPromoList = async () => {
    // setLoader(true)
    let action = constant.ACTION.PRODUCT_GROUP + 'PROMO_CODE?store=' + defaultStore + '&lang=' + currentLanguageCode;
    try {
      let response = await WebService.get(action);
      console.log(response);
      if (response) {
        setPromoData(response?.products)
      }
    } catch (error) {
      // setLoader(false)
    }
  }

  return (
    <div
      className={`support-area hm9-section-padding ${
        spaceTopClass ? spaceTopClass : ""
        } ${spaceBottomClass ? spaceBottomClass : ""} ${
        responsiveClass ? responsiveClass : ""
        }`}
      style={
        bgImg
          ? { backgroundImage: `url(${process.env.PUBLIC_URL + bgImg})` }
          : {}
      }
    >
      <div>
        <div className="row">
          {
            promoData.map((promo) => {
              return  <div style={{textAlign: 'center'}} className={promoData.length === 1 ? "col-lg-12" : promoData.length === 2 ? "col-lg-6" : promoData.length === 3 ? "col-lg-4" : "col-lg-3" }>
                <img src="/assets/img/promo/promo20.jpg" alt="promo20" style={{margin: '12px', boxShadow: '5px 5px 5px lightgrey'}}/>
                </div>
            })
            
          }

        </div>
      </div>
    </div>
  );
};

FeatureIcon.propTypes = {
  bgImg: PropTypes.string,
  containerClass: PropTypes.string,
  gutterClass: PropTypes.string,
  responsiveClass: PropTypes.string,
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