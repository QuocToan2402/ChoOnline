import React, { useEffect } from "react";

import Product from "../components/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../actions/productActions";

export default function HomeScreen() {
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
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); //useSelector is function redux
  const { loading, error, products } = productList; //value from redux list

  useEffect(() => {
    dispatch(listProducts()); //dispatch action
  }, [dispatch]);

  return (
    <div>
      {loading ? ( //if loading true, render loading component
        <LoadingBox></LoadingBox>
      ) : error ? ( // if has error, render message
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        // after loading and no error, render product
        <div className="row center">
          {products.map((product) => (
            <Product key={product._id} product={product}></Product>
          ))}
        </div>
      )}
    </div>
  );
}
