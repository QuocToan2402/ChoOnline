import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import {
    createProduct,
    deleteProduct,
    listProducts,
} from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
    PRODUCT_CREATE_RESET,
    PRODUCT_DELETE_RESET,
} from '../constants/productConstants';

export default function ProductListScreen(props) {
    const { pageNumber = 1 } = useParams();

    const sellerMode = props.match.path.indexOf('/seller') >= 0;//check if current user is seller
    const productList = useSelector((state) => state.productList);//get list product from redux store
    const { loading, error, products, page, pages } = productList;//get info list of product

    const productCreate = useSelector((state) => state.productCreate);
    const {
        //properties
        loading: loadingCreate,
        error: errorCreate,
        success: successCreate,
        product: createdProduct,
    } = productCreate;//properties come from productCreate action result

    const productDelete = useSelector((state) => state.productDelete);
    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
    } = productDelete;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const dispatch = useDispatch();
    useEffect(() => {
        if (successCreate) {// create successfully
            dispatch({ type: PRODUCT_CREATE_RESET });
            props.history.push(`/product/${createdProduct._id}/edit`);//redirect user to edit screen
        }
        if (successDelete) {//delete success
            dispatch({ type: PRODUCT_DELETE_RESET });
        }
        dispatch(
            listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber })//if seller mode is true, put user info, else put empty string
        );
    }, [
        createdProduct,
        dispatch,
        props.history,
        sellerMode,
        successCreate,
        successDelete,
        userInfo._id,
        pageNumber,
    ]);

    const deleteHandler = (product) => {
        if (window.confirm('Are you sure to delete?')) {
            dispatch(deleteProduct(product._id));
        }
    };
    const createHandler = () => {
        dispatch(createProduct());//implement create product action
    };
    return (
        <div>
            <div className="row">
                <h1>Sản Phẩm</h1>
                <button type="button" className="primary" onClick={createHandler}>
                    Thêm sản phẩm
                </button>
            </div>

            {loadingDelete && <LoadingBox></LoadingBox>}
            {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}

            {loadingCreate && <LoadingBox></LoadingBox>}
            {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
            {loading ? (
                <LoadingBox></LoadingBox>
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>TÊN</th>
                                <th>GIÁ</th>
                                <th>LOẠI</th>
                                <th>HÃNG</th>
                                <th>TÙY CHỌN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="small editbtn"
                                            onClick={() =>
                                                props.history.push(`/product/${product._id}/edit`)
                                            }
                                        >
                                            SỬA
                                        </button>
                                        <button
                                            type="button"
                                            className="small Delbtn"
                                            onClick={() => deleteHandler(product)}
                                        >
                                            XÓA
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="row center pagination">
                        {[...Array(pages).keys()].map((x) => (
                            <Link
                                className={x + 1 === page ? 'active' : ''}
                                key={x + 1}
                                to={`/productlist/pageNumber/${x + 1}`}
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
