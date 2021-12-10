import React, { useState } from 'react';

//search box redirect user to search pages
export default function SearchBox(props) {
    const [name, setName] = useState('');
    const submitHandler = (e) => {
        e.preventDefault();
        props.history.push(`/search/name/${name}`);
    };
    return (
        <form className="search" onSubmit={submitHandler}>
            <div className="row">
                <input
                    type="text"
                    id='searchtb'
                    name="q"
                    placeholder='Tìm kiếm trên E-Commerce'
                    onChange={(e) => setName(e.target.value)}
                ></input>
                <button className="primary" type="submit">
                    <i className="fa fa-search"></i>
                </button>
            </div>
        </form>
    );
}
