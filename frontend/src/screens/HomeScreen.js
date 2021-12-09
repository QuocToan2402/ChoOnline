import React, { useEffect } from "react";
import { Link, useParams } from 'react-router-dom';

import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";
//add carousel
import { listTopSellers } from '../actions/userActions';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';

export default function HomeScreen(props) {
  const {
    name = 'all',
    category = 'all',
    min = 0,
    max = 0,
    rating = 0,
    order = 'newest',
    pageNumber = 1,
  } = useParams();

  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); //useSelector is function redux
  const { loading, error, products, page, pages } = productList; //value from redux list
  
  const userTopSellersList = useSelector((state) => state.userTopSellersList);
  const {
    loading: loadingSellers,
    error: errorSellers,
    users: sellers,
  } = userTopSellersList;

  useEffect(() => {
    dispatch(listProducts({//if do not have any filter return all product
      pageNumber,
    })); //dispatch action
    dispatch(listTopSellers());
  }, [dispatch], pageNumber);
  
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || pageNumber;
    const filterCategory = filter.category || category;
    const filterName = filter.name || name;
    const filterRating = filter.rating || rating;
    const sortOrder = filter.order || order;
    const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
    const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
    return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}/pageNumber/${filterPage}`;

    //return `/pageNumber/${filterPage}`;
  };
  return (
    <div>
      <h2 className="custom-header">Thương nhân của tháng</h2>
      {loadingSellers ? (
        <LoadingBox></LoadingBox>
      ) : errorSellers ? (
        <MessageBox variant="danger">{errorSellers}</MessageBox>
      ) : (
        <>
          {sellers.length === 0 && <MessageBox>No Seller Found</MessageBox>}
          <Carousel showArrows autoPlay showThumbs={false}>
            {sellers.map((seller) => (
              <div key={seller._id}>
                <Link to={`/seller/${seller._id}`}>
                  <img src={seller.seller.logo} alt={seller.seller.name} />
                  <p className="legend">{seller.seller.name}</p>
                </Link>
              </div>
            ))}
          </Carousel>
        </>
      )}
      <h2 className="custom-header">Danh sách sản Phẩm</h2>
      {loading ? ( //if loading true, render loading component
        <LoadingBox></LoadingBox>
      ) : error ? ( // if has error, render message
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // after loading and no error, render product
        <>
          {products.length === 0 && (
            <MessageBox>Hiện không tìm thấy sản phẩm nào</MessageBox>
          )}
          <div className="row center">
            {products.map((product) => (
              <Product key={product._id} product={product}></Product>
            ))}
          </div>
          <div className="row center pagination">
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === page ? 'active' : ''}
                key={x + 1}
                to={getFilterUrl({ page: x + 1 })}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
