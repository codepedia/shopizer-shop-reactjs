import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import { getProductCartQuantity } from "../../helpers/product";
import { isValidObject } from "../../util/helper";
import { addToCart } from "../../redux/actions/cartActions";
// import { addToWishlist } from "../../redux/actions/wishlistActions";
// import { addToCompare } from "../../redux/actions/compareActions";
// import Rating from "./sub-components/ProductRating";
import StarRatings from 'react-star-ratings';
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { setLoader } from "../../redux/actions/loaderActions";

const ProductDescriptionInfo = ({
  product,
  // currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  // wishlistItem,
  // compareItem,
  addToast,
  addToCart,
  setLoader,
  productID,
  defaultStore,
  userData,
  strings
  // addToWishlist,
  // addToCompare
}) => {
  const [discountedPrice, setDiscountedPrice] = useState(finalDiscountedPrice)
  const [productPrice, setProductPrice] = useState(finalProductPrice)
  const [isDiscount, setIsDiscount] = useState(product.discounted)
  const [selectedProductColor, setSelectedProductColor] = useState([])
  const [quantityCount, setQuantityCount] = useState(1);
  useEffect(() => {
    // console.log(strings);
    getDefualtsOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDefualtsOption = async () => {
    let temp = [];
    if (product.options) {
      product.options.map(async (item) => {
        item.optionValues.map(async (data) => {
          if (data.defaultValue) {
            temp.push({ 'name': item.name, 'id': data.id });
          }
        })
      })
      setSelectedProductColor(temp)
      getPrice(temp)
    }
  }


  const onChangeOptions = async (value, option) => {

    let tempSelectedOptions = [];
    let index;
    if (option.type === 'radio' || option.type === 'select') {
      index = selectedProductColor.findIndex(a => a.name === option.name);
    } else {
      index = selectedProductColor.findIndex(a => a.id === value.id);
    }

    if (index === -1) {
      let temp = [...selectedProductColor, { 'name': option.name, 'id': value.id }]
      tempSelectedOptions = temp;
      setSelectedProductColor(temp)
      // setSelectedProductColor([...selectedProductColor, { 'name': option.name, 'id': value.id }])
    } else {
      let temp = [...selectedProductColor]
      if (option.type === 'radio' || option.type === 'select') {
        temp[index] = { 'name': option.name, 'id': value.id };

      } else {
        temp.splice(index, 1);
      }
      tempSelectedOptions = temp;
      setSelectedProductColor(temp)
    }
    // console.log(tempSelectedOptions);
    getPrice(tempSelectedOptions)

  }
  const getPrice = async (tempSelectedOptions) => {
    setLoader(true)
    let action = constant.ACTION.PRODUCT + productID + '/' + constant.ACTION.PRICE;
    let param = { "options": tempSelectedOptions }
    try {
      let response = await WebService.post(action, param);
      if (response) {
        // setProductDetails(response)
        setDiscountedPrice(response.finalPrice);
        setProductPrice(response.originalPrice);
        setIsDiscount(response.discounted);
        // finalDiscountedPrice = response.originalPrice
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
    }
  }
  const checkedOrNot = (value) => {
    let index = selectedProductColor.findIndex(a => a.id === value.id);
    console.log(index)
    if (index === -1) {
      return false
    } else {
      return true
    }
  }
  return (
    <div className="product-details-content ml-70">
      <h2>{product.description.name}</h2>
      <div className="product-details-price">
        {isDiscount ? (
          <Fragment>
            <span>{discountedPrice}</span>{" "}
            <span className="old">
              {productPrice}
            </span>
          </Fragment>
        ) : (
          <span>{productPrice} </span>
        )}
      </div>
      {/* {product.rating && product.rating > 0 ? ( */}
      <div className="pro-details-rating-wrap">
        <div className="pro-details-rating">
          {product?.rating > 0 && <span style={{fontWeight: 600, marginRight: '10px'}}>{product?.rating}</span>}
          <StarRatings
            rating={product?.rating}
            starRatedColor="#ffa900"
            starDimension="17px"
            starSpacing="1px"
            numberOfStars={5}
            name='view-rating'
          />
          <span style={{fontWeight: 600, marginLeft: '10px', color: '#2162a1'}}>({product?.ratingCount} ratings)</span>
        </div>
      </div>
      {/* ) : (
          ""
        )} */}
      <div className="pro-details-list">
        <p dangerouslySetInnerHTML={{ __html: product.description.description }}></p>
      </div>

      {product.options ? (
        <div className="pro-details-size-color">
          {
            product.options.map((option, key) => {
              return (
                option.type === 'radio' &&
                <div className="pro-details-color-wrap" key={key}>
                  <span>Select {option.name}</span>
                  <div className="options-container">
                    {

                      option.optionValues.map((value, index) => {
                        return (
                          <label className={checkedOrNot(value) ? "option selected": "option"}>
                            <input type={option.type} name={option.name} value={value.id} onChange={() => onChangeOptions(value, option)} checked={checkedOrNot(value)} />
                            {/* <img src="https://via.placeholder.com/100" alt="Product Image" /> */}
                            {/* {value.image ? <img src={value.image} alt="product-option" /> : <div className="color-option" style={{ backgroundColor: value.code }}></div>} */}
                            <div className="details" style={{color: value.code}}>
                              <label>{value.description.name}</label>
                              {/* <span>{value.price && '(' + value.price + ')'}</span> */}
                            </div>
                          </label>
                          // <div style={{ flexDirection: 'row', display: 'flex', alignItems: 'center', margin: 15 }} key={index}>
                          //   {value.image && <img src={value.image} alt="product-option" />}

                          //   <label className={`pro-details-color-content--single`} style={{ backgroundColor: value.code }} key={index} >

                          //     <input
                          //       type={option.type}
                          //       value={value.id}
                          //       name={option.name}
                          //       checked={checkedOrNot(value)}
                          //       onChange={() => onChangeOptions(value, option)}
                          //     />
                          //     <span className="checkmark"></span>

                          //   </label>
                          //   <label>{value.description.name} {value.price && '(' + value.price + ')'}</label>
                          // </div>
                        );
                      })
                      // )
                    }

                  </div>
                </div>
              )
            })
          }
          {

            product.options.map((option, index) => {
              return (
                option.type === 'select' &&
                <div className="pro-details-size" key={index}>
                  <span>Select {option.name}</span>
                  <div className="pro-details-size-content">
                    {
                      <select onChange={(e) => { onChangeOptions(JSON.parse(e.target.value), option) }}>
                        {/* <option>Select a country</option> */}
                        {

                          option.optionValues.map((singleSize, i) => {
                            return <option key={i} value={JSON.stringify(singleSize)} selected={checkedOrNot(singleSize)}>{singleSize.description.name}  {singleSize.price && '(' + singleSize.price + ')'}</option>
                          })
                        }
                      </select>

                    }
                  </div>
                </div>
              )
            })
          }
          {

            product.options.map((option, index) => {
              return (
                option.type === 'checkbox' &&
                <div className="pro-details-size" key={index}>
                  <span>Select {option.name}</span>
                  <div className="pro-details-size-content" style={{ display: 'flex' }}>
                    {
                      option.optionValues.map((singleSize, key) => {
                        return (
                          <div style={{ flexDirection: 'column ', display: 'flex', alignItems: 'center', marginRight: 15 }} key={key}>
                            {singleSize.image && <img src={singleSize.image} alt="product-option" />}

                            <label className={checkedOrNot(singleSize) ? `pro-details-size-content--single selected` : `pro-details-size-content--single`} key={key}  >
                              <input
                                type="checkbox"
                                value={singleSize.description.name}
                                name={option.name}
                                checked={checkedOrNot(singleSize)}
                                onChange={() => {
                                  onChangeOptions(singleSize, option)
                                  // setSelectedProductSize(singleSize.name);
                                  //   setProductStock(singleSize.stock);
                                  //   setQuantityCount(1);
                                }}
                              />
                              <span className="size-name">{singleSize.description.name}  </span>
                            </label>
                            {/* {singleSize.price && '(' + singleSize.price + ')'} */}
                          </div>
                        );

                      })}
                  </div>
                </div>
              )
            })
          }
        </div>
      ) : (
        ""
      )}
      {
        //   product.affiliateLink ? (
        //   <div className="pro-details-quality">
        //     <div className="pro-details-cart btn-hover ml-0">
        //       <a
        //         href={product.affiliateLink}
        //         rel="noopener noreferrer"
        //         target="_blank"
        //       >
        //         Buy Now
        //       </a>
        //     </div>
        //   </div>
        // ) : (
        <div className="pro-details-quality">
          <div className="cart-plus-minus">
            <button onClick={() => setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)} className="dec qtybutton">-</button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button onClick={() => setQuantityCount(quantityCount < product.quantity ? quantityCount + 1 : quantityCount)} className="inc qtybutton">+</button>
          </div>
          <div className="pro-details-cart btn-hover">
            {product.available && product.canBePurchased && product.visible && product.quantity > 0 ? (
              <button
                onClick={() => {
                  let options = [];
                  selectedProductColor.forEach((a) => {
                    options.push({ id: a.id })
                  })

                  addToCart(
                    product,
                    addToast,
                    cartItems,
                    quantityCount,
                    defaultStore,
                    userData,
                    options
                  )
                }}>
                {" "}
                {strings["Add to cart"]}{" "}
              </button>
            ) : (
              <button disabled>{strings["Out of Stock"]}</button>
            )}
          </div>
          {/* <div className="pro-details-wishlist">
            <button
              className={wishlistItem !== undefined ? "active" : ""}
              disabled={wishlistItem !== undefined}
              title={
                wishlistItem !== undefined
                  ? "Added to wishlist"
                  : "Add to wishlist"
              }
              onClick={() => addToWishlist(product, addToast)}
            >
              <i className="pe-7s-like" />
            </button>
          </div>
          <div className="pro-details-compare">
            <button
              className={compareItem !== undefined ? "active" : ""}
              disabled={compareItem !== undefined}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={() => addToCompare(product, addToast)}
            >
              <i className="pe-7s-shuffle" />
            </button>
          </div> */}
        </div>
        // )
      }
      {/* <div className="pro-details-meta">
        <span>{strings["SKU"]} :</span>
        <ul>
          <li >
            <Link to="">
              {product.sku}
            </Link>
          </li>
        </ul>
      </div> */}
      {/* {product.categories && product.categories.length > 0 ? (
        <div className="pro-details-meta">
          <span>{strings["Categories"]} :</span>
          <ul>
            {product.categories.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={"/category/" + single.description.friendlyUrl}>
                    {single.description.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )} */}
      {/* {product.tag ? (
        <div className="pro-details-meta">
          <span>Tags :</span>
          <ul>
            {product.tag.map((single, key) => {
              return (
                <li key={key}>
                  <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
                    {single}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
          ""
        )} */}
      {/**
      <div className="pro-details-social">
        <ul>
          <li>
            <a href="//facebook.com">
              <i className="fa fa-facebook" />
            </a>
          </li>
          <li>
            <a href="//dribbble.com">
              <i className="fa fa-dribbble" />
            </a>
          </li>
          <li>
            <a href="//pinterest.com">
              <i className="fa fa-pinterest-p" />
            </a>
          </li>
          <li>
            <a href="//twitter.com">
              <i className="fa fa-twitter" />
            </a>
          </li>
          <li>
            <a href="//linkedin.com">
              <i className="fa fa-linkedin" />
            </a>
          </li>
        </ul>
      </div>
      */}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  addToCart: PropTypes.func,
  // addToCompare: PropTypes.func,
  // addToWishlist: PropTypes.func,
  addToast: PropTypes.func,
  cartItems: PropTypes.object,
  // compareItem: PropTypes.array,
  // currency: PropTypes.object,
  // discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.string,
  finalProductPrice: PropTypes.string,
  product: PropTypes.object,
  // wishlistItem: PropTypes.object
};
const mapStateToProps = (state, ownProps) => {
  const prodID = ownProps.product.id;
  return {
    productID: prodID,
    cartItems: state.cartData.cartItems,
    defaultStore: state.merchantData.defaultStore,
    userData: state.userData.userData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoader: (value) => {
      dispatch(setLoader(value));
    },
    addToCart: (
      item,
      addToast,
      cartItem,
      quantityCount,
      defaultStore,
      userData,
      selectedProductColor
    ) => {

      let index = isValidObject(cartItem) ? cartItem.products.findIndex(cart => cart.id === item.id) : -1;
      dispatch(
        addToCart(
          item,
          addToast,
          cartItem.code,
          index === -1 ? quantityCount : cartItem.products[index].quantity + quantityCount,
          defaultStore,
          userData,
          selectedProductColor
        )
      );
    },
    // addToWishlist: (item, addToast) => {
    //   dispatch(addToWishlist(item, addToast));
    // },
    // addToCompare: (item, addToast) => {
    //   dispatch(addToCompare(item, addToast));
    // }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductDescriptionInfo);
