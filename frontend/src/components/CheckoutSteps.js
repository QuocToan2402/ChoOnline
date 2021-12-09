import React from 'react';

//checkout step bar, if true change class to active
export default function CheckoutSteps(props) {
  return (
    <div className="row checkout-steps">
      <div className={props.step1 ? 'active' : ''}>Mua sắm</div>
      <div className={props.step2 ? 'active' : ''}>Thông tin giao hàng</div>
      <div className={props.step3 ? 'active' : ''}>Phương thức thanh toán</div>
      <div className={props.step4 ? 'active' : ''}>Xác nhận thanh toán</div>
    </div>
  );
}
