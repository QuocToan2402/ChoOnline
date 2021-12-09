import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

//NOTE: profile screen is a private route
export default function ProfileScreen() {
    const [name, setName] = useState('');//get current info
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    //seller
    const [sellerName, setSellerName] = useState('');
    const [sellerLogo, setSellerLogo] = useState('');
    const [sellerDescription, setSellerDescription] = useState('');

    const userSignin = useSelector((state) => state.userSignin);//redux store
    const { userInfo } = userSignin;//get user info from user signin
    const userDetails = useSelector((state) => state.userDetails);//get user from redux
    const { loading, error, user } = userDetails;//get detail info from be

    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);//get info from redux
    const {
        success: successUpdate,
        error: errorUpdate,
        loading: loadingUpdate,
    } = userUpdateProfile;

    const dispatch = useDispatch();
    useEffect(() => {
        if (!user) {//null, run detail user action
            dispatch({ type: USER_UPDATE_PROFILE_RESET });//reset if done action and reload
            dispatch(detailsUser(userInfo._id));//fuc run, get user detail by user id
        } else {//set current info
            setName(user.name);
            setEmail(user.email);
            if (user.seller) {//set value from db
                setSellerName(user.seller.name);
                setSellerLogo(user.seller.logo);
                setSellerDescription(user.seller.description);
            }
        }
    }, [dispatch, userInfo._id, user]);//dependencies list, when user change, user effect will run again

    const submitHandler = (e) => {//send from data to be
        e.preventDefault();
        // dispatch update profile
        if (password !== confirmPassword) { //not true
            alert('Password and Confirm Password Are Not Matched');
        } else {//update info
            dispatch(
                updateUserProfile({
                    userId: user._id,
                    name,
                    email,
                    password,
                    sellerName,
                    sellerLogo,
                    sellerDescription,
                })
            );
        }
    };
    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Thông tin người dùng</h1>
                </div>
                {loading ? (
                    <LoadingBox></LoadingBox>
                ) : error ? (
                    <MessageBox variant="danger">{error}</MessageBox>
                ) : (
                    <>
                        {loadingUpdate && <LoadingBox></LoadingBox>}
                        {errorUpdate && (
                            <MessageBox variant="danger">{errorUpdate}</MessageBox>
                        )}
                        {successUpdate && (
                            <MessageBox variant="success">
                                Chỉnh sửa thành công!
                            </MessageBox>
                        )}
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
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="mật khẩu"
                                onChange={(e) => setPassword(e.target.value)}
                            ></input>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="xác nhận mật khẩu"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            ></input>
                        </div>
                        {user.isSeller && (
                            <>
                                <h2>Seller</h2>
                                <div>
                                    <label htmlFor="sellerName">Tên seller</label>
                                    <input
                                        id="sellerName"
                                        type="text"
                                        placeholder="tên seller"
                                        value={sellerName}
                                        onChange={(e) => setSellerName(e.target.value)}
                                    ></input>
                                </div>
                                <div>
                                    <label htmlFor="sellerLogo">Seller Logo</label>
                                    <input
                                        id="sellerLogo"
                                        type="text"
                                        placeholder="Seller Logo"
                                        value={sellerLogo}
                                        onChange={(e) => setSellerLogo(e.target.value)}
                                    ></input>
                                </div>
                                <div>
                                    <label htmlFor="sellerDescription">Miêu tả</label>
                                    <input
                                        id="sellerDescription"
                                        type="text"
                                        placeholder="miêu tả"
                                        value={sellerDescription}
                                        onChange={(e) => setSellerDescription(e.target.value)}
                                    ></input>
                                </div>
                            </>
                        )} 
                        <div>
                            <label />
                            <button className="primary" type="submit">
                                Lưu
                            </button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
}
