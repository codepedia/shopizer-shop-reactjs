import { FETCH_PRODUCTS_SUCCESS, SET_PRODUCT_ID, SET_CATEGORY_ID, SET_CATEGORY_FRIENDLYURL, SET_PRODUCT_CODE } from "../actions/productActions";

const initState = {
  products: [],
  productid: '',
  categoryid: '',
  friendlyUrl: '',
  productCode: ''
};

const productReducer = (state = initState, action) => {

  if (action.type === FETCH_PRODUCTS_SUCCESS) {
    return {
      ...state,
      products: action.payload
    };
  }
  if (action.type === SET_PRODUCT_ID) {
    return {
      ...state,
      productid: action.payload
    };
  }
  if (action.type === SET_CATEGORY_ID) {
    return {
      ...state,
      categoryid: action.payload
    };
  }
  if (action.type === SET_CATEGORY_FRIENDLYURL) {
    return {
      ...state,
      friendlyUrl: action.payload
    };
  }
  if (action.type === SET_PRODUCT_CODE) {
    return {
      ...state,
      productCode: action.payload
    };
  }
  return state;
};

export default productReducer;
