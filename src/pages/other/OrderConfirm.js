import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState, useCallback } from "react";
// import { Link } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import Layout from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { connect } from "react-redux";
import { multilanguage } from "redux-multilanguage";
import { setLoader } from "../../redux/actions/loaderActions";
import constant from '../../util/constant';
import WebService from '../../util/webService';
import { isValidObject } from "../../util/helper";

const OrderConfirm = ({ location, orderID, strings, merchant, setLoader }) => {
  const { pathname } = location;
  const [orderDetails, setorderDetails] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [total, setTotal] = useState(0);

  const getOrderDetails = useCallback(async () => {
    setLoader(true)
    let action = constant.ACTION.AUTH + constant.ACTION.ORDERS + orderID;
    try {
      let response = await WebService.get(action);
      if (response) {
        // console.log(response)
        setorderDetails(response)
        response.totals.forEach(element => {
          if (element.module === 'subtotal') {
            setSubTotal(element.value)
          } else if (element.module === 'shipping') {
            setShipping(element.value)
          } else if (element.module === 'total') {
            setTotal(element.value)
          }
        })
        // // setConfig(response)
      }
      setLoader(false)
    } catch (error) {
      setLoader(false)
      console.log(error, '------------')
    }
  }, [orderID, setLoader])

  useEffect(() => {
    getOrderDetails()
  }, [getOrderDetails])

  function defaultImage(product) {
    if (product.images && product.images.length > 0) {
      return product.images[0].imageUrl;
    } else if (product.image != null) {
      return product.imageUrl;
    } else {
      return '/assets/img/no-image.png';
    }
  }

  return (
    <Fragment>
      <MetaTags>
        <title>{merchant.name} | {strings["Order Confirm"]}</title>
        {/* <meta
          name="description"
          content="404 page of flone react minimalist eCommerce template."
        /> */}
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["Home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["Order Confirm"]}
      </BreadcrumbsItem>
      <Layout headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-2"
        headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="error-area pt-40 pb-40">
          {isValidObject(orderDetails) ?
            <div className="container confirm-details-container">
              <div class="thank-you-section">

                <h1><img src="assets/img/confirm.gif" alt="confirm-gif" /> Thank you, your order has been placed.</h1>
                <div style={{ padding: '20px 0' }}><p>Your order will be processed within 24 hours during working days. We will notify you by email once your order has been shipped.</p></div>
                <div class="billing-info">
                  <h3>Billing address</h3>
                  <table>

                    <tr>
                      <td><p><strong>Name</strong></p></td>
                      <td><p style={{ marginLeft: '40px' }}>{orderDetails?.billing?.firstName} {orderDetails?.billing?.lastName}</p></td>
                    </tr>
                    <tr>
                      <td><p><strong>Address</strong></p></td>
                      <td><p style={{ marginLeft: '40px' }}>{orderDetails?.billing?.address},  {orderDetails?.billing?.city} {orderDetails?.billing?.zone} {orderDetails?.billing?.country}, {orderDetails?.billing?.postalCode}</p></td>
                    </tr>
                    <tr>
                      <td><p><strong>Phone</strong></p></td>
                      <td><p style={{ marginLeft: '40px' }}>{orderDetails?.billing?.phone}</p></td>
                    </tr>
                    <tr>
                      <td><p><strong>Email</strong></p></td>
                      <td><p style={{ marginLeft: '40px' }}>{orderDetails?.billing?.email}</p></td>
                    </tr>
                  </table>
                  {/* <p><strong>Name</strong>: Jane Smith</p>
                <p><strong>Address</strong>: 456 Oak St #3b, San Francisco, CA 94102, United States</p>
                <p><strong>Phone</strong>: +1 (415) 555-1234</p>
                <p><strong>Email</strong>: jane.smith@email.com</p> */}
                </div>
                <button class="track-button">Track Your Order</button>
              </div>

              <div class="order-summary">
                <h2>Order Summary</h2>
                <div class="order-details">
                  <div class="info row">
                    <p className="col-4 info-details"><strong>Date</strong><br />{orderDetails?.datePurchased}</p>
                    <p className="col-4 info-details"><strong>Order Number</strong><br />{orderDetails?.id}</p>
                    <p className="col-4"><strong>Payment Method</strong><br />{orderDetails?.paymentType}</p>
                  </div>
                  <div style={{ padding: '15px 0', borderBottom: '1px solid lightgrey' }}>
                    {
                      orderDetails?.products?.map((orderItem, key) => {
                        return (<div class="product">
                          <img src={defaultImage(orderItem?.product)} alt="All In One Chocolate Combo" />
                          <div class="product-details">
                            <p><strong>{orderItem?.productName}</strong></p>
                            <p>Qty: {orderItem?.orderedQuantity}</p>
                          </div>
                          <p class="price">{orderItem?.subTotal}</p>
                        </div>)
                      })
                    }

                  </div>
                  <div class="pricing">
                    <p><b>Sub Total</b><span>${subTotal}</span></p>
                    <p><b>Shipping ({orderDetails?.shippingModule})</b><span>${shipping}</span></p>
                    {/* <p>Tax<span>$5.00</span></p> */}
                  </div>

                  <div class="total">
                    <p><strong>Order Total</strong><span><strong>${total}</strong></span></p>
                  </div>
                </div>
              </div>
            </div>
            :
            <>Plese Wait</>
          }
        </div>
      </Layout>
    </Fragment >
  );
};

OrderConfirm.propTypes = {
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    orderID: state.cartData.orderID,
    merchant: state.merchantData.merchant
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoader: (value) => {
      dispatch(setLoader(value));
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(multilanguage(OrderConfirm));
// export default OrderConfirm;
