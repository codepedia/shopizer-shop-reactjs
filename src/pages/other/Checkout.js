import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import MetaTags from "react-meta-tags";
import { connect } from "react-redux";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
// import { getDiscountPrice } from "../../helpers/product";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { isValidObject } from "../../util/helper";
import constant from '../../util/constant';
import WebService from '../../util/webService';
import { getCountry, getState } from "../../redux/actions/userAction";
import { useForm, Controller } from "react-hook-form";
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement, Elements, ElementsConsumer
} from '@stripe/react-stripe-js';
import { useToasts } from "react-toast-notifications";
import { setLoader } from "../../redux/actions/loaderActions";
import {
  deleteAllFromCart
} from "../../redux/actions/cartActions";
import Script from 'react-load-script';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
const paymentForm = {
  firstName: {
    name: "firstName",
    validate: {
      required: {
        value: true,
        message: "Firstname is required"
      }
    }
  },
  lastName: {
    name: "lastName",
    validate: {
      required: {
        value: true,
        message: "Lastname is required"
      }
    }
  },
  company: {
    name: "company"
  },
  address: {
    name: "address",
    validate: {
      required: {
        value: true,
        message: "Address is required"
      }
    }
  },
  city: {
    name: "city",
    validate: {
      required: {
        value: true,
        message: "City is required"
      }
    }
  },
  country: {
    name: "country",
    validate: {
      required: {
        value: true,
        message: "Country is required"
      }
    }
  },
  stateProvince: {
    name: "stateProvince",
    validate: {
      required: {
        value: true,
        message: "State is required"
      }
    }
  },
  postalCode: {
    name: "postalCode",
    validate: {
      required: {
        value: true,
        message: "Postal code is required"
      }
    }
  },
  phone: {
    name: "phone",
    validate: {
      required: {
        value: true,
        message: "Phone number is required"
      },
      minLength: {
        value: 10,
        message: "Enter a 10-digit number"
      }
    }
  },
  email: {
    name: "email",
    validate: {
      required: {
        value: true,
        message: "Email is required"
      },
      pattern: {
        value: /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i,
        message: 'Please entered the valid email id'
      }
    }
  },
  shipFirstName: {
    name: "shipFirstName",
    validate: {
      required: {
        value: true,
        message: "Firstname is required"
      }
    }
  },
  shipLastName: {
    name: "shipLastName",
    validate: {
      required: {
        value: true,
        message: "Lastname is required"
      }
    }
  },
  shipCompany: {
    name: "shipCompany"
  },
  shipAddress: {
    name: "shipAddress",
    validate: {
      required: {
        value: true,
        message: "Address is required"
      }
    }
  },
  shipCity: {
    name: "shipCity",
    validate: {
      required: {
        value: true,
        message: "City is required"
      }
    }
  },
  shipCountry: {
    name: "shipCountry",
    validate: {
      required: {
        value: true,
        message: "Country is required"
      }
    }
  },
  shipStateProvince: {
    name: "shipStateProvince",
    validate: {
      required: {
        value: true,
        message: "State is required"
      }
    }
  },
  shipPostalCode: {
    name: "shipPostalCode",
    validate: {
      required: {
        value: true,
        message: "Postal code is required"
      }
    }
  },
  isAgree: {
    name: "isAgree",
    validate: {
      required: {
        value: true,
        message: "Please agree to our terms and conditions"
      }
    }
  },
  password: {
    name: "password",
    validate: {
      required: {
        value: true,
        message: "Password is required"
      },
      validate: {
        hasSpecialChar: (value) => (value && value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)) || 'Password must be minimum of 8 characters atleast one number and one special character'
      }
    }
  },
  repeatPassword: {
    name: "repeatPassword",
    validate: {
      required: {
        value: true,
        message: "Repeat Password is required"
      }
    }
  }
}
const CARD_ELEMENT_OPTIONS = {
  iconStyle: "solid",
  hidePostalCode: true,
  style: {
    base: {
      iconColor: "#303238",
      color: "#303238",
      fontSize: "16px",
      fontFamily: '"Open Sans", sans-serif',
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#CFD7DF"
      }
    },
    invalid: {
      color: "#e5424d",
      ":focus": {
        color: "#e5424d"
      }
    }
  }
};
const Checkout = ({ location, cartID, defaultStore, getCountry, getState, countryData, stateData, currentLocation, userData, setLoader, deleteAllFromCart }) => {
  const { pathname } = location;
  const history = useHistory();
  const { addToast } = useToasts();
  const [config, setConfig] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [isShipping, setIsShipping] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [timer, setTimer] = useState('');
  const [shippingOptions, setShippingOptions] = useState();
  const [shippingQuote, setShippingQuote] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState('');
  const { register, control, handleSubmit, errors, setValue, watch, reset, setError, clearErrors } = useForm({
    mode: "onChange",
    criteriaMode: "all"
  });

  const [ref, setRef] = useState(null)
  useEffect(() => {
    getSummaryOrder()

    getState('')
    getCountry()
    getConfig()
    shippingQuoteChange('')
    onChangeShipping()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getSummaryOrder = async () => {
    let action = constant.ACTION.CART + cartID + '?store=' + defaultStore;
    try {
      let response = await WebService.get(action);
      if (response) {
        setCartItems(response)
      }
    } catch (error) {
    }
    if (userData) {
      getProfile()
    } else {
      setDefualtsValue()
    }
  }
  const setDefualtsValue = () => {
    if (currentLocation.length > 0) {
      setValue('country', currentLocation.find(i => i.types.some(i => i === "country")).address_components[0].short_name)
      setValue('city', currentLocation.find(i => i.types.some(i => i === "locality")).address_components[0].short_name)
      setValue('stateProvince', currentLocation.find(i => i.types.some(i => i === "administrative_area_level_1")).address_components[0].short_name)
    }
  }
  const getProfile = async () => {
    let action = constant.ACTION.AUTH + constant.ACTION.CUSTOMER + constant.ACTION.PROFILE;
    try {
      let response = await WebService.get(action);
      if (response) {
        console.log(response.billing.firstName);
        setValue('firstName', response.billing.firstName)
        setValue('lastName', response.billing.lastName)
        setValue('company', response.billing.company)
        setValue('address', response.billing.address)
        setValue('country', response.billing.country)
        setValue('city', response.billing.city)
        setValue('stateProvince', response.billing.stateProvince)
        setValue('postalCode', response.billing.postalCode)
        setValue('phone', response.billing.phone)
        setValue('email', response.emailAddress)

        if (response.delivery) {
          setValue('shipFirstName', response.delivery.firstName)
          setValue('shipLastName', response.delivery.lastName)
          setValue('shipCompany', response.delivery.company)
          setValue('shipAddress', response.delivery.address)
          setValue('shipCountry', response.delivery.country)
          setValue('shipCity', response.delivery.city)
          setValue('shipStateProvince', response.delivery.stateProvince)
          setValue('shipPostalCode', response.delivery.postalCode)
        }
        onChangeShipping()
        // setConfig(response)
      }
    } catch (error) {
    }
  }
  const getConfig = async () => {
    let action = constant.ACTION.CONFIG;
    try {
      let response = await WebService.get(action);
      if (response) {
        setConfig(response)
      }
    } catch (error) {
    }
  }
  const onChangeShipAddress = async () => {
    setIsShipping(!isShipping)
    // console.log(currentLocation.find(i => i.types.some(i => i == "country")).address_components[0].short_name)
    if (currentLocation.length > 0) {
      setTimeout(() => {
        setValue('shipCountry', currentLocation.find(i => i.types.some(i => i === "country")).address_components[0].short_name)
        setValue('shipCity', currentLocation.find(i => i.types.some(i => i === "locality")).address_components[0].short_name)
        setValue('shipStateProvince', currentLocation.find(i => i.types.some(i => i === "administrative_area_level_1")).address_components[0].short_name)
        onChangeShipping()
      }, 1000);
    }
  }
  const handleScriptLoad = () => {
    // Declare Options For Autocomplete
    const options = {
      types: ['address'],
    };
    // console.log('fsdfsdfsdfdsf')
    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    let autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options,
    );
    // console.log(autocomplete)
    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    // this.autocomplete.setFields(['address_components', 'formatted_address']);

    // Fire Event when a suggested name is selected
    autocomplete.addListener('place_changed', () => {
      let p = autocomplete.getPlace();
      console.log(p);
      setValue('country', p.address_components.find(i => i.types.some(i => i === "country")).short_name)
      getState(p.address_components.find(i => i.types.some(i => i === "country")).short_name)

      let city = p.address_components.find(i => i.types.some(i => i === "locality"))
      if (city !== undefined) {
        setValue('city', city.short_name)
      }
      let pCode = p.address_components.find(i => i.types.some(i => i === "postal_code"))
      if (pCode !== undefined) {
        setValue('postalCode', pCode.long_name)
      }

      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        sublocality: 'sublocality'
      };
      let array = [];
      for (var i = 0; i < p.address_components.length; i++) {
        var addressType = p.address_components[i].types[0];
        if (componentForm[addressType]) {
          var val = p.address_components[i][componentForm[addressType]];
          array.push(val);

        }
      }
      setValue('address', array.toString())
      setTimeout(() => {
        setValue('stateProvince', p.address_components.find(i => i.types.some(i => i === "administrative_area_level_1")).short_name)
      }, 2000);

      onChangeShipping()
    });
  }
  const onChangeShipping = async () => {
    // console.log(watch('shipPostalCode'))
    let action = constant.ACTION.CART + cartID + '/' + constant.ACTION.SHIPPING;
    let param = {};
    if (isShipping) {
      param = { 'postalCode': watch('shipPostalCode'), 'countryCode': watch('shipCountry') }
    } else {
      param = { 'postalCode': watch('postalCode'), 'countryCode': watch('country') }
    }
    try {
      let response = await WebService.post(action, param);
      // console.log(response.shippingOptions);
      if (response) {
        setShippingOptions(response.shippingOptions)
        setSelectedOptions(response.shippingOptions[response.shippingOptions.length - 1].shippingQuoteOptionId)
        shippingQuoteChange(response.shippingOptions[response.shippingOptions.length - 1].shippingQuoteOptionId)
      }
    } catch (error) {
    }
  }
  const shippingQuoteChange = async (quoteID) => {
    let action;
    if (quoteID) {
      action = constant.ACTION.CART + cartID + '/' + constant.ACTION.TOTAL + '?quote=' + quoteID;
    } else {
      action = constant.ACTION.CART + cartID + '/' + constant.ACTION.TOTAL;
    }
    // console.log(action)
    try {
      let response = await WebService.get(action);
      // console.log(response, '--------------');
      if (response) {
        setShippingQuote(response.totals)
      }
    } catch (error) {
    }

  }
  const onSubmitOrder = async (data, elements, stripe) => {
    setLoader(true)
    let card = elements.getElement(CardElement);
    // console.log(card);
    // let ownerInfo = {
    //   owner: {
    //     name: data.firstName + ' ' + data.lastName,
    //     phone: data.phone,
    //     email: data.email
    //   },
    // };
    const result = await stripe.createToken(card);
    // console.log(result)
    // stripe.createSource(card, ownerInfo).then(function (result) {
    if (result.error) {
      setLoader(false)
      addToast(result.error.message, { appearance: "error", autoDismiss: true });
    } else {
      // console.log(result);
      onPayment(data, result.token.id)
    }
    // });
  }
  const onPayment = async (data, token) => {
    let action;
    console.log(data);
    let param = {};
    if (userData) {
      action = constant.ACTION.AUTH + constant.ACTION.CART + cartID + '/' + constant.ACTION.CHECKOUT
      param = {
        "shippingQuote": selectedOptions,
        "currency": "USD",
        "payment": {
          "paymentType": "CREDITCARD",
          "transactionType": "CAPTURE",
          "paymentModule": "stripe",
          "paymentToken": token,
          "amount": shippingQuote[shippingQuote.length - 1].value
        }
      }
    } else {
      action = constant.ACTION.CART + cartID + '/' + constant.ACTION.CHECKOUT
      let customer = {};
      if (isShipping) {
        customer = {
          "emailAddress": data.email,
          "billing": {
            "address": data.address,
            // "company": data.company,
            "city": data.city,
            "postalCode": data.postalCode,
            "country": data.country,
            // "stateProvince": data.stateProvince,
            "zone": data.stateProvince,
            "firstName": data.firstName,
            "lastName": data.lastName,
            // "phone": data.phone
          },
          "delivery": {
            "address": data.shipAddress,
            // "company": data.shipCompany,
            "city": data.shipCity,
            "postalCode": data.shipPostalCode,
            "country": data.shipCountry,
            // "stateProvince": data.shipStateProvince,
            "zone": data.shipStateProvince,
            "firstName": data.shipFirstName,
            "lastName": data.shipLastName,
            // "phone": data.shipPhone
          }
        }
      } else {
        customer = {
          "emailAddress": data.email,
          "billing": {
            "address": data.address,
            // "company": data.company,
            "city": data.city,
            "postalCode": data.postalCode,
            "country": data.country,
            // "stateProvince": data.stateProvince,
            "zone": data.stateProvince,
            "firstName": data.firstName,
            "lastName": data.lastName,
            // "phone": data.phone
          }
        }
      }
      if (isAccount) {
        customer['password'] = data.password;
        customer['repeatPassword'] = data.repeatPassword;
      }
      param = {
        "shippingQuote": selectedOptions,
        "currency": "USD",
        "payment": {
          "paymentType": "CREDITCARD",
          "transactionType": "CAPTURE",
          "paymentModule": "stripe",
          "paymentToken": token,
          "amount": shippingQuote[shippingQuote.length - 1].value
        },
        "customer": customer
      }
    }
    console.log(param);
    // 
    try {
      let response = await WebService.post(action, param);
      // console.log(response)
      if (response) {
        reset({})
        ref.clear()
        deleteAllFromCart(response.id)
        addToast("Your order has been submitted", { appearance: "success", autoDismiss: true });
        history.push('/order-confirm')
      }
      setLoader(false)
    } catch (error) {
      addToast("Your order submission has been failed", { appearance: "error", autoDismiss: true });
      setLoader(false)
    }

  }


  const onConfirmPassword = (e) => {
    if (watch('password') !== e.target.value) {
      return setError(
        paymentForm.repeatPassword.name,
        {
          type: "notMatch",
          message: "Repeat Password should be the same as a password"
        }
      );
    }

  }
  const onPasswordChange = (e) => {
    // console.log(e.target.value)
    // console.log(watch('repeatPassword'))
    if (watch('repeatPassword') !== '' && watch('repeatPassword') !== e.target.value) {
      return setError(
        paymentForm.repeatPassword.name,
        {
          type: "notMatch",
          message: "Repeat Password should be the same as a password"
        }
      );

    } else {
      clearErrors(paymentForm.repeatPassword.name);
    }

  }
  return (
    <Fragment>
      <MetaTags>
        <title>Importa | Checkout</title>
        {/* <meta
          name="description"
          content="Checkout page of flone react minimalist eCommerce template."
        /> */}
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>Home</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        Checkout
      </BreadcrumbsItem>
      <LayoutOne headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-2"
        headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="checkout-area pt-95 pb-100">

          <div className="container">
            {

              isValidObject(cartItems) && cartItems.products.length > 0 && !userData &&
              <div className="checkout-heading">
                <Link to={"/login"}>Returning customer ? Click here to login</Link>
              </div>

            }

            {isValidObject(cartItems) && cartItems.products.length > 0 ? (

              <form>
                <div className="row">
                  <div className="col-lg-6">
                    <div className="billing-info-wrap">
                      <h3>Billing Details</h3>
                      <div className="row">

                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>First Name</label>
                            <input type="text" name={paymentForm.firstName.name} ref={register(paymentForm.firstName.validate)} />
                            {errors[paymentForm.firstName.name] && <p className="error-msg">{errors[paymentForm.firstName.name].message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Last Name</label>
                            <input type="text" name={paymentForm.lastName.name} ref={register(paymentForm.lastName.validate)} />
                            {errors[paymentForm.lastName.name] && <p className="error-msg">{errors[paymentForm.lastName.name].message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Company Name</label>
                            <input type="text" name={paymentForm.company.name} ref={register(paymentForm.company.validate)} />
                          </div>
                        </div>

                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Street Address</label>
                            <Script
                              url={"https://maps.googleapis.com/maps/api/js?key=" + process.env.REACT_APP_MAP_API_KEY + "&libraries=places"}
                              onLoad={handleScriptLoad}
                            />
                            <input
                              className="billing-address"
                              placeholder="House number and street name"
                              type="text"
                              id="autocomplete"
                              name={paymentForm.address.name}
                              ref={register(paymentForm.address.validate)}
                            />
                            {errors[paymentForm.address.name] && <p className="error-msg">{errors[paymentForm.address.name].message}</p>}

                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Country</label>

                            <Controller
                              name={paymentForm.country.name}
                              control={control}
                              rules={paymentForm.country.validate}
                              render={props => {
                                return (
                                  // console.log(props) ||
                                  <select onChange={(e) => { props.onChange(e.target.value); getState(e.target.value); onChangeShipping() }} value={props.value}>
                                    <option>Select a country</option>
                                    {

                                      countryData.map((data, i) => {
                                        return <option key={i} value={data.code}>{data.name}</option>
                                      })
                                    }
                                  </select>
                                )
                              }}
                            />

                            {errors[paymentForm.country.name] && <p className="error-msg">{errors[paymentForm.country.name].message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Town / City</label>
                            <input type="text" name={paymentForm.city.name} ref={register(paymentForm.city.validate)} />
                            {errors[paymentForm.city.name] && <p className="error-msg">{errors[paymentForm.city.name].message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-select mb-20">
                            <label>State</label>
                            {
                              stateData && stateData.length > 0 ?
                                <Controller
                                  name={paymentForm.stateProvince.name}
                                  control={control}
                                  rules={paymentForm.stateProvince.validate}
                                  render={props => {
                                    return (
                                      <select onChange={(e) => props.onChange(e.target.value)} value={props.value}>
                                        <option>Select a state</option>
                                        {
                                          stateData.map((data, i) => {
                                            return <option key={i} value={data.code}>{data.name}</option>
                                          })
                                        }
                                      </select>)
                                  }}
                                />
                                :
                                <input type="text" name={paymentForm.stateProvince.name} ref={register(paymentForm.stateProvince.validate)} />
                            }
                            {errors[paymentForm.stateProvince.name] && <p className="error-msg">{errors[paymentForm.stateProvince.name].message}</p>}

                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Postcode / ZIP</label>
                            <input type="text" name={paymentForm.postalCode.name} ref={register(paymentForm.postalCode.validate)} onChange={() => {

                              clearTimeout(timer);
                              setTimer(setTimeout(function () {
                                onChangeShipping()
                              }, 500))
                            }} />
                            {errors[paymentForm.postalCode.name] && <p className="error-msg">{errors[paymentForm.postalCode.name].message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Phone</label>
                            <input type="text" name={paymentForm.phone.name} ref={register(paymentForm.phone.validate)} />
                            {errors[paymentForm.phone.name] && <p className="error-msg">{errors[paymentForm.phone.name].message}</p>}
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Email Address</label>
                            <input type="text" name={paymentForm.email.name} ref={register(paymentForm.email.validate)} />
                            {errors[paymentForm.email.name] && <p className="error-msg">{errors[paymentForm.email.name].message}</p>}
                          </div>
                        </div>
                      </div>
                      {
                        !userData &&
                        <div className="login-toggle-btn">
                          <input type="checkbox" value={isAccount} onChange={() => setIsAccount(!isAccount)} />
                          <label className="ml-10 mb-20">Create an account</label>
                        </div>
                      }
                      {
                        isAccount &&
                        <div>
                          <p style={{ color: '#fb799c' }}> Create an account by entering the information below.If you are a returning customer please login using the link at the top of the page.</p>
                          <div className="col-lg-12">
                            <div className="billing-info mb-20">
                              <label>Account Password</label>
                              <input type="password" name={paymentForm.password.name} ref={register(paymentForm.password.validate)} onChange={(e) => onPasswordChange(e)} />
                              {errors[paymentForm.password.name] && <p className="error-msg">{errors[paymentForm.password.name].message}</p>}
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="billing-info mb-20">
                              <label>Repeat Account Password</label>
                              <input type="password" name={paymentForm.repeatPassword.name} ref={register(paymentForm.repeatPassword.validate)} onChange={(e) => onConfirmPassword(e)} />
                              {errors[paymentForm.repeatPassword.name] && <p className="error-msg">{errors[paymentForm.repeatPassword.name].message}</p>}
                            </div>
                          </div>
                        </div>
                      }
                      <div className="login-toggle-btn">
                        <input type="checkbox" value={isShipping} onChange={onChangeShipAddress} />
                        <label className="ml-10 mb-20">SHIP TO A DIFFERENT ADDRESS?</label>
                      </div>
                      {
                        isShipping &&
                        <div className="billing-info-wrap">
                          <h3>Shipping Details</h3>
                          <div className="row">

                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>First Name</label>
                                <input type="text" name={paymentForm.shipFirstName.name} ref={register(paymentForm.shipFirstName.validate)} />
                                {errors[paymentForm.shipFirstName.name] && <p className="error-msg">{errors[paymentForm.shipFirstName.name].message}</p>}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>Last Name</label>
                                <input type="text" name={paymentForm.shipLastName.name} ref={register(paymentForm.shipLastName.validate)} />
                                {errors[paymentForm.shipLastName.name] && <p className="error-msg">{errors[paymentForm.shipLastName.name].message}</p>}
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="billing-info mb-20">
                                <label>Company Name</label>
                                <input type="text" name={paymentForm.shipCompany.name} ref={register(paymentForm.shipCompany.validate)} />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="billing-info mb-20">
                                <label>Street Address</label>
                                <input
                                  className="billing-address"
                                  placeholder="House number and street name"
                                  type="text"
                                  name={paymentForm.shipAddress.name}
                                  ref={register(paymentForm.shipAddress.validate)}
                                />
                                {errors[paymentForm.shipAddress.name] && <p className="error-msg">{errors[paymentForm.shipAddress.name].message}</p>}

                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="billing-select mb-20">
                                <label>Country</label>

                                <Controller
                                  name={paymentForm.shipCountry.name}
                                  control={control}
                                  rules={paymentForm.shipCountry.validate}
                                  render={props => {
                                    return (
                                      <select onChange={(e) => { props.onChange(e.target.value); getState(e.target.value); onChangeShipping() }} value={props.value}>
                                        <option>Select a country</option>
                                        {

                                          countryData.map((data, i) => {
                                            return <option key={i} value={data.code}>{data.name}</option>
                                          })
                                        }
                                      </select>
                                    )
                                  }}
                                />

                                {errors[paymentForm.shipCountry.name] && <p className="error-msg">{errors[paymentForm.shipCountry.name].message}</p>}
                              </div>
                            </div>
                            <div className="col-lg-12">
                              <div className="billing-info mb-20">
                                <label>Town / City</label>
                                <input type="text" name={paymentForm.shipCity.name} ref={register(paymentForm.shipCity.validate)} />
                                {errors[paymentForm.shipCity.name] && <p className="error-msg">{errors[paymentForm.shipCity.name].message}</p>}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-select mb-20">
                                <label>State</label>
                                {
                                  stateData && stateData.length > 0 ?
                                    <Controller
                                      name={paymentForm.shipStateProvince.name}
                                      control={control}
                                      rules={paymentForm.shipStateProvince.validate}
                                      render={props => {
                                        return (
                                          <select onChange={(e) => props.onChange(e.target.value)} value={props.value}>
                                            <option>Select a state</option>
                                            {
                                              stateData.map((data, i) => {
                                                return <option key={i} value={data.code}>{data.name}</option>
                                              })
                                            }
                                          </select>)
                                      }}
                                    />
                                    :
                                    <input type="text" name={paymentForm.shipStateProvince.name} ref={register(paymentForm.shipStateProvince.validate)} />
                                }
                                {errors[paymentForm.shipStateProvince.name] && <p className="error-msg">{errors[paymentForm.shipStateProvince.name].message}</p>}

                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>Postcode / ZIP</label>
                                <input type="text" name={paymentForm.shipPostalCode.name} ref={register(paymentForm.shipPostalCode.validate)} onChange={() => {
                                  clearTimeout(timer);
                                  setTimer(setTimeout(function () {
                                    onChangeShipping()
                                  }, 500))
                                }} />
                                {errors[paymentForm.shipPostalCode.name] && <p className="error-msg">{errors[paymentForm.shipPostalCode.name].message}</p>}
                              </div>
                            </div>
                            {/* <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>Phone</label>
                                <input type="text" name={paymentForm.shipPhone.name} ref={register(paymentForm.shipPhone.validate)} />
                                {errors[paymentForm.shipPhone.name] && <p className="error-msg">{errors[paymentForm.shipPhone.name].message}</p>}
                              </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                              <div className="billing-info mb-20">
                                <label>Email Address</label>
                                <input type="text" name={paymentForm.shipEmail.name} ref={register(paymentForm.shipEmail.validate)} />
                                {errors[paymentForm.shipEmail.name] && <p className="error-msg">{errors[paymentForm.shipEmail.name].message}</p>}
                              </div>
                            </div> */}
                          </div>
                        </div>
                      }
                      <div className="additional-info-wrap">
                        <h4>Additional information</h4>
                        <div className="additional-info">
                          <label>Order notes</label>
                          <textarea
                            placeholder="Notes about your order, e.g. special notes for delivery. "
                            name="message"
                            defaultValue={""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="your-order-area">
                      <h3>Your order</h3>
                      <div className="your-order-wrap gray-bg-4">
                        <div className="your-order-product-info">
                          <div className="your-order-top">
                            <ul>
                              <li>Product</li>
                              <li>Total</li>
                            </ul>
                          </div>
                          <div className="your-order-middle">
                            <ul>
                              {cartItems.products.map((cartItem, key) => {

                                return (
                                  <li key={key}>
                                    <span className="order-middle-left" style={{ width: 220 }}>
                                      {cartItem.description.name}
                                    </span>{" "}
                                    <span>X {cartItem.quantity}</span>
                                    <span className="order-price">
                                      {
                                        cartItem.finalPrice
                                      }
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          <div className="your-order-sub-total">
                            {
                              shippingQuote.length > 0 &&
                              shippingQuote.map((quote, i) => {
                                return (
                                  quote.title !== 'Total' &&
                                  <ul className="mb-20" key={i}>
                                    <li className="order-total">{quote.title}</li>
                                    <li>
                                      {quote.total}
                                    </li>
                                  </ul>)
                              })
                            }

                          </div>
                          <div className="your-order-bottom">
                            {
                              config.displayShipping && shippingOptions &&
                              <div className="shippingRow">
                                <ul><li className="your-order-shipping">Shipping Fees</li></ul>

                                <ul>

                                  {
                                    shippingOptions.map((value, i) => {
                                      return (<li key={i}>
                                        <div className="login-toggle-btn">
                                          <input type="radio" value={value.shippingQuoteOptionId} onChange={() => { setSelectedOptions(value.shippingQuoteOptionId); shippingQuoteChange(value.shippingQuoteOptionId) }} checked={selectedOptions === value.shippingQuoteOptionId} />
                                          <label className="ml-10 mb-20">{value.optionName} - {value.optionPriceText}</label>
                                        </div>
                                      </li>)
                                    })
                                  }
                                  <li style={{ textAlign: 'center', fontSize: 12, color: 'grey' }}> This option let you reserve you order items through the online system and pick
                                        up your order by yourself at the store. this option is also offered when no
                                        other shipping option is available for your region.</li>
                                </ul>
                              </div>

                            }

                            {
                              config.displayShipping && !shippingOptions &&
                              <ul>
                                <li className="your-order-shipping">Shipping Fees</li>
                                <li>Free shipping</li>
                              </ul>
                            }

                          </div>
                          <div className="your-order-total">
                            <ul>
                              <li className="order-total">Total</li>
                              <li>
                                {
                                  shippingQuote.length > 0 &&
                                  shippingQuote.map((quote, i) => {
                                    return quote.title === 'Total' && quote.total
                                  })
                                }
                                {/* {cartItems.displayTotal} */}
                              </li>
                            </ul>
                          </div>
                        </div>

                      </div>
                      <div className="payment-method mt-25">

                        <Elements stripe={stripePromise}>
                          <ElementsConsumer>
                            {({ stripe, elements }) => (
                              <>
                                <div className="card-info">
                                  <CardElement options={CARD_ELEMENT_OPTIONS} stripe={stripe} onReady={e => setRef(e)} />
                                </div>
                                <div className="icon-container">
                                  <i className="fa fa-cc-visa" style={{ color: 'navy' }}></i>
                                  <i className="fa fa-cc-amex" style={{ color: 'blue' }}></i>
                                  <i className="fa fa-cc-mastercard" style={{ color: 'red' }}></i>
                                  {/*<i className="fa fa-cc-discover" style={{ color: 'orange' }}></i>*/}
                                </div>

                                <div className="place-order mt-100">
                                  <div className="login-toggle-btn mb-20">
                                    <input type="checkbox" name={paymentForm.isAgree.name} ref={register(paymentForm.isAgree.validate)} />
                                    <label className="ml-10 ">I agree with the terms and conditions</label>
                                    {errors[paymentForm.isAgree.name] && <p className="error-msg">{errors[paymentForm.isAgree.name].message}</p>}
                                  </div>
                                  <button type="button" onClick={handleSubmit((d) => onSubmitOrder(d, elements, stripe))} className="btn-hover">Place Order</button>
                                </div>
                              </>
                            )}
                          </ElementsConsumer>
                        </Elements>

                      </div>

                    </div>
                  </div>

                </div>
              </form>
            ) : (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="item-empty-area text-center">
                      <div className="item-empty-area__icon mb-30">
                        <i className="pe-7s-cash"></i>
                      </div>
                      <div className="item-empty-area__text">
                        No items found in cart to checkout <br />{" "}
                        <Link to={"/"}>
                          Shop Now
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

Checkout.propTypes = {
  cartItems: PropTypes.object,
  // currency: PropTypes.object,
  location: PropTypes.object
};

const mapStateToProps = state => {
  return {
    cartID: state.cartData.cartID,
    countryData: state.userData.country,
    stateData: state.userData.state,
    currentLocation: state.userData.currentAddress,
    userData: state.userData.userData,
    defaultStore: state.merchantData.defaultStore
    // currency: state.currencyData
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoader: (value) => {
      dispatch(setLoader(value));
    },
    getCountry: () => {
      dispatch(getCountry());
    },
    getState: (code) => {
      dispatch(getState(code));
    },
    deleteAllFromCart: (orderID) => {
      dispatch(deleteAllFromCart(orderID));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
