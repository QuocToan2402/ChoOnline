import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Axios from 'axios';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
    const productId = props.match.params.id;//get id from urls
    const [name, setName] = useState('');//hook for product info
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    const productDetails = useSelector((state) => state.productDetails);//get info from react-redux
    const { loading, error, product } = productDetails;//get state of action

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    const dispatch = useDispatch();
    useEffect(() => {
        if (successUpdate) {//update success reset info
            if(userInfo.isAdmin === true){
                props.history.push('/productlist');//push new info to list product
            }
            else if(userInfo.isSeller === true){
                props.history.push('/productlist/seller');//push new info to list product
            }
        }
        if (!product || product._id !== productId || successUpdate) {//
            dispatch({ type: PRODUCT_UPDATE_RESET });//if update success reset info
            dispatch(detailsProduct(productId));
        } else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [product, dispatch, productId, successUpdate, props.history]);

    const submitHandler = (e) => {
        e.preventDefault();
        // TODO: dispatch update product
        dispatch(
            updateProduct({//redirect user after update
                _id: productId,
                name,
                price,
                image,
                category,
                brand,
                countInStock,
                description,
            })
        );
    };
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState('');
    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setLoadingUpload(true);
        try {
            const { data } = await Axios.post('/api/uploads', bodyFormData, {//data from upload api
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            setImage(data);//set date
            setLoadingUpload(false);//set effect loading
        } catch (error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Chỉnh sửa thông tin sản phẩm {productId}</h1>
                </div>
                {loadingUpdate && <LoadingBox></LoadingBox>}
                {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        <div>
                            <label htmlFor="name">Tên</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="tên"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="price">Giá</label>
                            <input
                                id="price"
                                type="text"
                                placeholder="giá"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="image">Ảnh minh họa</label>
                            <input
                                id="image"
                                type="text"
                                placeholder="ảnh"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="imageFile">File ảnh</label>
                            <input
                                type="file"
                                id="imageFile"
                                label="Choose Image"
                                onChange={uploadFileHandler}
                            ></input>
                            {loadingUpload && <LoadingBox></LoadingBox>}
                            {errorUpload && (
                                <MessageBox variant="danger">{errorUpload}</MessageBox>
                            )}
                        </div>
                        <div>
                            <label htmlFor="category">Loại sản phẩm</label>
                            <input
                                id="category"
                                type="text"
                                placeholder="loại"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="brand">Người bán</label>
                            <input
                                id="brand"
                                type="text"
                                placeholder="Người bán"
                                value={product.seller.seller.name}
                                onChange={(e) => setBrand(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="countInStock">Số lượng</label>
                            <input
                                id="countInStock"
                                type="text"
                                placeholder="Số lượng"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="description">Miêu tả</label>
                            <textarea
                                id="description"
                                rows="3"
                                type="text"
                                placeholder="miêu tả"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label></label>
                            <button className="primary" type="submit">
                                Cập nhật
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
