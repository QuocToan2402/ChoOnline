import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

//grap route from react router dom and only render if user is sign in
export default function PrivateRoute({ component: Component, ...rest }) {//component and rest
    const userSignin = useSelector((state) => state.userSignin);//get user info from signin
    const { userInfo } = userSignin;//get info
    return (
        <Route
            {...rest}//
            render={(props) =>
                userInfo ? (//check user info if not exist
                    <Component {...props}></Component>//render component
                ) : (
                    <Redirect to="/signin" />//return
                )
            }
        ></Route>
    );
}
