import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect, useRef } from 'react';
import MetaTags from 'react-meta-tags';
import { useHistory } from "react-router-dom";
// import Paginator from 'react-hooks-paginator';
import { BreadcrumbsItem } from 'react-breadcrumbs-dynamic';
import { connect } from 'react-redux';
// import { getSortedProducts } from '../../helpers/product';
import Layout from '../../layouts/Layout';
import Breadcrumb from '../../wrappers/breadcrumb/Breadcrumb';
import ShopSidebar from '../../wrappers/product/ShopSidebar';
import ShopTopbar from '../../wrappers/product/ShopTopbar';
import ShopProducts from '../../wrappers/product/ShopProducts';
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { isCheckValueAndSetParams } from '../../util/helper';
import { setLoader } from "../../redux/actions/loaderActions";
import { multilanguage } from "redux-multilanguage";
import { setCategoryID, setCategoryFrindlyUrl } from "../../redux/actions/productActions";
import ReactPaginate from 'react-paginate';

const Category = ({ setCategoryID, isLoading, strings, location, defaultStore, currentLanguageCode, categoryID, setLoader, friendlyUrl, setCategoryFrindlyUrl, childCategory }) => {
    const [layout, setLayout] = useState('grid three-column');
    const history = useHistory();
    // const [sortType, setSortType] = useState('');
    const [categoryValue, setCategoryValue] = useState('');
    const [categoryURL, setCategoryURL] = useState('');
    // const [filterSortType, setFilterSortType] = useState('');
    // const [filterSortValue, setFilterSortValue] = useState('');
    const [offset, setOffset] = useState(0);
    // const [skip, setSkip] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const pageLimit = parseInt(window._env_.APP_PRODUCT_GRID_LIMIT) || 6;
    const [productData, setProductData] = useState([]);
    const [totalProduct, setTotalProduct] = useState(0);
    const [productDetails, setProductDetails] = useState('');
    const [subCategory, setSubCategory] = useState([]);
    const [manufacture, setManufacture] = useState([]);
    const [color, setColor] = useState([]);
    const [size, setSize] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [selectedManufature, setSelectedManufature] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    // const [sortedProducts, setSortedProducts] = useState([]);
    const [showFilter, setShowFilter] = useState(false);
    const containerRef = useRef(null); // Reference to the container
    const [height, setHeight] = useState(0); // State to store height
    const { pathname } = location;

    const getLayout = (layout) => {
        setLayout(layout)
    }
    useEffect(() => {
        // Function to update the height
        const updateHeight = () => {
            if (containerRef.current) {
                setHeight(containerRef.current.offsetHeight); // Get the height
            }
        };

        // Call initially to set height
        updateHeight();

        // Update height on window resize
        window.addEventListener("resize", updateHeight);

        // Cleanup event listener on unmount
        return () => {
            window.removeEventListener("resize", updateHeight);
        };
    }); // Empty dependency array ensures this runs once

    const getSortParams = (sortType, sortValue) => {
        // console.log(sortType)
        let tempSelectedOption = selectedOption;
        let tempSelectedManufature = selectedManufature;
        if (sortType === 'size' || sortType === 'color') {
            let index = selectedOption.findIndex(a => a === sortValue);
            // console.log(index)
            if (index === -1) {
                tempSelectedOption = [...selectedOption, sortValue]
            } else {
                tempSelectedOption.splice(index, 1);
            }
            // console.log(tempSelectedSize)
            setSelectedOption(tempSelectedOption)
        }
        else if (sortType === 'manufacturer') {
            let index = selectedManufature.findIndex(a => a === sortValue);
            // console.log(index)
            if (index === -1) {
                tempSelectedManufature = [...selectedManufature, sortValue]
            } else {
                tempSelectedManufature.splice(index, 1);
            }
            // console.log(tempSelectedSize)
            setSelectedManufature(tempSelectedManufature)
        }
        // console.log(categoryValue, tempSelectedOption, selectedManufature)
        if (selectedCategory.length > 0) {
            getProductList(selectedCategory, tempSelectedOption, tempSelectedManufature, categoryURL)
        } else {
            getProductList(categoryValue, tempSelectedOption, tempSelectedManufature, categoryURL)
        }

    }

    const getCategoryParams = (sortType, sortValue) => {
        console.log(sortValue)
        // console.log(sortType)
        // console.log(sortValue)
        // setCategoryValue(sortValue)
        // setCategoryID(sortValue.id)
        // setCategoryFrindlyUrl(sortValue.description.friendlyUrl)
        // history.push("/category/" + sortValue.description.friendlyUrl)
        let tempSelectedCategory = selectedCategory;
        let index = selectedCategory.findIndex(a => a === sortValue.id);
        // console.log(index)
        if (index === -1) {
            tempSelectedCategory = [...selectedCategory, sortValue.id]
        } else {
            tempSelectedCategory.splice(index, 1);
        }
        console.log(tempSelectedCategory)
        setSelectedCategory(tempSelectedCategory)
        if (tempSelectedCategory.length > 0) {
            getProductList(tempSelectedCategory, selectedOption, selectedManufature)
        } else {
            getProductList(categoryValue, selectedOption, selectedManufature)
        }
    }

    useEffect(() => {

        setCategoryValue(categoryID)
        setCategoryURL(friendlyUrl)
        setSubCategory([])
        setColor([])
        setManufacture([])
        setSize([])
        setSelectedManufature([])
        setSelectedOption([])
        setSelectedCategory([])
        getProductList(categoryID, [], [], friendlyUrl)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryID, offset]);
    const getProductList = async (categoryid, size, manufacture, friendlyUrl) => {
        setLoader(true)
        // setProductData([]);
        // let action = `${constant.ACTION.PRODUCTS} + '?store=' + defaultStore + '&lang=' + currentLanguageCode + '&start=' + offset + '&count=' + pageLimit + '&category=' + categoryID`;
        let action = `${constant.ACTION.PRODUCTS}?${isCheckValueAndSetParams('&store=', defaultStore)}${isCheckValueAndSetParams('&lang=', currentLanguageCode)}${isCheckValueAndSetParams('&page=', offset)}${isCheckValueAndSetParams('&count=', pageLimit)}${isCheckValueAndSetParams('&categoryIds=', categoryid)}${isCheckValueAndSetParams('&optionValueIds=', size.join())}${isCheckValueAndSetParams('&manufacturer=', manufacture.join())}`;
        try {
            let response = await WebService.get(window._env_.APP_BASE_URL + '/api/v2/' + action);
            if (response) {
                setCurrentPage(response.totalPages)
                setProductData(response.products);
                setTotalProduct(response.recordsTotal)
            }
            setLoader(false)
        } catch (error) {
            setLoader(false)
        }
        if (selectedCategory.length === 0) {
            getCategoryDetails(categoryid, friendlyUrl)
        }

    }
    const getCategoryDetails = async (categoryid, friendlyUrl) => {

        // let action = constant.ACTION.CATEGORY + friendlyUrl + '?store=' + defaultStore + '&lang=' + currentLanguageCode;
        // try {
        //     let response = await WebService.get(action);
        //     // console.log(response.children);
        //     if (response) {
        //         //console.log(response);
        //         history.push(response.description.friendlyUrl)
        //         setProductDetails(response);
        //         // let temp = response.children;
        //         // console.log(temp)
        //         setSubCategory(response.children);
        //     }
        // } catch (error) {
        // }
        let childData = childCategory.filter((val) => val.id === categoryid);
        console.log(childData)
        if (childData.length > 0) {
            setProductDetails(childData[0]);
            if (childData[0].children.length > 0) {
                setSubCategory(childData[0].children);
            }
        }
        getManufacturers(categoryid)
    }
    const getManufacturers = async (categoryid) => {
        let action = constant.ACTION.CATEGORY + categoryid + '/' + constant.ACTION.MANUFACTURERS + '?store=' + defaultStore + '&lang=' + currentLanguageCode
        try {
            let response = await WebService.get(action);
            //console.log(JSON.stringify(response));
            if (response) {
                setManufacture(response)
            }
        } catch (error) {
        }
        getVariants(categoryid)
    }
    const getVariants = async (categoryid) => {
        let action = constant.ACTION.CATEGORY + categoryid + '/' + constant.ACTION.VARIANTS;
        try {
            let response = await WebService.get(window._env_.APP_BASE_URL + '/api/v2/' + action);
            // console.log(response);
            if (response) {
                response.forEach(variant => {
                    if (variant.code === 'color') {
                        setColor(variant.options);
                    } else if (variant.code === "size") {
                        setSize(variant.options.reverse());
                    }
                });

            }
        } catch (error) {
        }
    }
    return (
        <Fragment>
            <MetaTags>
                <title>{productDetails && productDetails.description.title}</title>
                <meta name="description" content={productDetails && productDetails.description.metaDescription} />
            </MetaTags>

            <BreadcrumbsItem to={process.env.PUBLIC_URL + '/'}>{strings["Home"]}</BreadcrumbsItem>
            {productDetails && productDetails.parent !== null && <BreadcrumbsItem onClick={() => setCategoryID(productDetails.parent.id)} to={"/category/" + productDetails.parent.code}>{productDetails.parent.code}</BreadcrumbsItem>}
            <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>{productDetails && productDetails.description.name}</BreadcrumbsItem>

            <Layout headerContainerClass="container-fluid"
                headerPaddingClass="header-padding-2"
                headerTop="visible">
                {/* breadcrumb */}
                <Breadcrumb />

                <div className="shop-area pt-40 pb-100" ref={containerRef}>
                    <div className="container">


                        <div className="row">
                            {/* <div className="col-lg-3 order-2 order-lg-1"> */}
                            {/* shop sidebar */}
                            {/* <ShopSidebar products={products} getSortParams={getSortParams} sideSpaceClass="mr-30" /> */}
                            {
                                showFilter && <ShopSidebar height={height} string={strings} getSortParams={getSortParams} getCategoryParams={getCategoryParams} uniqueCategories={subCategory} uniqueColors={color} uniqueSizes={size} uniqueManufacture={manufacture} sideSpaceClass="mr-30" closeFilter={() => setShowFilter(false)} />
                            }

                            {/* </div> */}
                            {
                                productData.length > 0 ?
                                    (<div className="col-lg-12 order-1 order-lg-2">
                                        {/* shop topbar default */}
                                        {/* <ShopTopbar getLayout={getLayout} getFilterSortParams={getFilterSortParams} productCount={products.length} sortedProductCount={productData.length} /> */}
                                        <ShopTopbar strings={strings} getLayout={getLayout} productCount={totalProduct} offset={offset + 1} pageLimit={pageLimit} sortedProductCount={productData.length} togglePopup={() => setShowFilter(!showFilter)} />

                                        {/* shop page content default */}
                                        <ShopProducts strings={strings} layout={layout} products={productData} />

                                        {/* shop product pagination */}

                                        {
                                            totalProduct > productData.length &&
                                            <div className="pro-pagination-style text-center mt-30">
                                                <ReactPaginate
                                                    previousLabel={'«'}
                                                    nextLabel={'»'}
                                                    breakLabel={'...'}
                                                    breakClassName={'break-me'}
                                                    pageCount={currentPage}
                                                    onPageChange={(e) => setOffset(e.selected)}
                                                    containerClassName={'mb-0 mt-0'}
                                                    activeClassName={'page-item active'}
                                                />
                                            </div>
                                        }

                                    </div>)
                                    :
                                    (!isLoading &&
                                        <div className="col-lg-9 order-1 order-lg-2">
                                            <div className="item-empty-area text-center">
                                                <div className="item-empty-area__icon mb-30">
                                                    <i className="pe-7s-shopbag"></i>
                                                </div>
                                                <div className="item-empty-area__text">
                                                    {strings["No items found in category"]}<br />{" "}

                                                </div>
                                            </div>
                                        </div>)
                            }
                        </div>
                    </div>
                </div>
            </Layout>
        </Fragment>
    )
}

Category.propTypes = {
    location: PropTypes.object,
    products: PropTypes.array
}

const mapStateToProps = state => {

    return {
        currentLanguageCode: state.multilanguage.currentLanguageCode,
        defaultStore: state.merchantData.defaultStore,
        categoryID: state.productData.categoryid,
        friendlyUrl: state.productData.friendlyUrl,
        isLoading: state.loading.isLoading,
        childCategory: state.productData.categoryData

    }
}
const mapDispatchToProps = dispatch => {
    return {
        setLoader: (value) => {
            dispatch(setLoader(value));
        },
        setCategoryID: (value) => {
            dispatch(setCategoryID(value));
        },
        setCategoryFrindlyUrl: (value) => {
            dispatch(setCategoryFrindlyUrl(value));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(multilanguage(Category));