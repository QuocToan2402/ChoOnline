import React from "react";

export default function CartScreen(props) {
  const productId = props.match.params.id; //get ID
  const qty = props.location.search //get from urls
    ? Number(props.location.search.split("=")[1])
    : 1; //default value is 1
  return (
    <div>
      <h1>Cart Screen</h1>
      <p>
        ADD TO CART : ProductID: {productId} Qty: {qty}
      </p>
    </div>
  );
}
