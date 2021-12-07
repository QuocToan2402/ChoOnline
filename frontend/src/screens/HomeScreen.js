import React, { useEffect } from "react";
import { Link, useParams } from 'react-router-dom';

import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";

export default function HomeScreen(props) {
  /*const [products, setProducts] = useState([]); //use react hook to manage state of component, change value of product use setproduct fuc
  const [loading, setLoading] = useState(false); //show loading 
  const [error, setError] = useState(false);  //show error if cant't get data

  useEffect(() => { //hook, run after render data, run only 1 time.
    const fetchData = async () => {
      try {
        setLoading(true); //show loading before sending request
        const { data } = await axios.get('/api/products'); //get data from axios request to server
        setLoading(false);
        setProducts(data);
      } 
      catch (err) {
        setError(err.message);//show error if cant't get data
        setLoading(false);
      }
    };
    fetchData();
  }, []); //*/
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

  useEffect(() => {
    dispatch(listProducts({
      pageNumber,
    })); //dispatch action
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
      {loading ? ( //if loading true, render loading component
        <LoadingBox></LoadingBox>
      ) : error ? ( // if has error, render message
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // after loading and no error, render product
        <>
          {products.length === 0 && (
            <MessageBox>No Product Found</MessageBox>
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
