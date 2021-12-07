import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

export default function AdminRoute({ component: Component, ...rest }) {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    return (
        <Route
            {...rest}
            render={(props) =>
                userInfo && userInfo.isAdmin ? (//check há user and user is admin
                    <Component {...props}></Component>
                ) : (
                    <Redirect to="/signin" />
                )
            }
        ></Route>
    );
}
