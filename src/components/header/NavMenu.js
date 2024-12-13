import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { connect } from "react-redux";

import { setCategoryID, setCategoryFrindlyUrl } from "../../redux/actions/productActions";
import { setContent } from "../../redux/actions/contentAction";
const NavMenu = ({ props, strings, menuWhiteClass, sidebarMenu, categories, contents, setCategoryID, setContent, setCategoryFrindlyUrl }) => {

  const onClickCategory = (item) => {
    console.log(item)
    setCategoryID(item.id)
    setCategoryFrindlyUrl(item.description.friendlyUrl)
  }
  const onClickContent = (item) => {
    setContent(item)
  }
  return (
    <div
      className={` ${sidebarMenu
        ? "sidebar-menu"
        : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
        } `}
    >
      <nav>
        <ul>
          <li>
            <Link to={"/"}>
              {strings["Home"]}
            </Link>
          </li>
          {
            categories.map((item, index) => {
              return (
                item.visible &&
                <li key={index}>
                  <Link to={"/category/" + item.description.friendlyUrl} onClick={() => onClickCategory(item)}>
                    <span>
                      {item.description.name}
                      {item.children && item.children.length > 0 ?
                        sidebarMenu ? (
                          <span>
                            <i className="fa fa-angle-right"></i>
                          </span>
                        ) : (
                          <i className="fa fa-angle-down" />
                        )
                        : ''
                      }
                    </span>

                  </Link>
                  {
                    item.children && item.children.length > 0 &&
                    <ul className="submenu">
                      {
                        item.children.map((submenu, index) => {
                          return (<li key={index}>
                            <Link to={"/category/" + submenu.description.friendlyUrl} onClick={() => onClickCategory(submenu)} >
                              {submenu.description.name}
                            </Link>
                          </li>)
                        })
                      }

                    </ul>
                  }
                </li>
              )
            })
          }
          {
            contents.map((content, index) => {
              return (
                content.visible && content.description &&
                <li key={index}> <Link to={"/content/" + content.description.friendlyUrl} onClick={() => onClickContent(content.code)}> {content.description.name}</Link></li>
              )
            })
          }
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
  strings: PropTypes.object
};
const mapDispatchToProps = dispatch => {
  return {
    setCategoryID: (value) => {
      dispatch(setCategoryID(value));
    },
    setContent: (value) => {
      dispatch(setContent(value));
    },
    setCategoryFrindlyUrl: (value) => {
      dispatch(setCategoryFrindlyUrl(value));
    }
  };
};
export default connect(null, mapDispatchToProps)(multilanguage(NavMenu));
// export default multilanguage(NavMenu);
