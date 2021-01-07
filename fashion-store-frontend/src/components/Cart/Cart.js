import { Container } from '@material-ui/core';
import { Button, Col, InputNumber, notification, Row } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import CartItem from './CartItem';
import './Cart.css';
import { currencyFormat } from '../../utils/NumberFormat';
import { useState } from 'react';
import { useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import Axios from 'axios';

// let products = [
//     {
//         id: "1",
//         name: "Ao nam",
//         img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR5wV-hb1HVpDFxiauwakIwb1S3InjIIS2ZhQ&usqp=CAU",
//         price: 1000000,
//         discount: 50,
//         description:
//             "Definitely annoying though. A simple check for Xcode installation and then an update during the OS update would be pretty simple to add. It's always something with these OS updates from Apple. You'd think they'd have figured it out by now",
//         amount: 10,
//     },
//     {
//         id: "2",
//         name: "Ao nu",
//         img:
//             "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcR5wV-hb1HVpDFxiauwakIwb1S3InjIIS2ZhQ&usqp=CAU",
//         price: 2000000,
//         discount: 20,
//         description:
//             "Definitely annoying though. A simple check for Xcode installation and then an update during the OS update would be pretty simple to add. It's always something with these OS updates from Apple. You'd think they'd have figured it out by now",
//         amount: 5,
//     },
// ];

function Cart(props) {
    const history = useHistory();
    const token = localStorage.getItem('token');
    let cart = JSON.parse(localStorage.getItem('cart'));
    const [listProduct, setListProduct] = useState(cart === null ? [] : cart);
    const [totalPrice, setTotalPrice] = useState(0);
    let cartOrder = JSON.parse(localStorage.getItem('cart'));

    useEffect(() => {
        setTotalPrice(showTotalPrice());
    }, [listProduct]);
    const updateProduct = (id, amount) => {
        console.log('pay ', id, ' ,quan ', amount);
        let index = findIndex(id);
        let tmp = listProduct;
        tmp[index].amount = amount;
        setListProduct(tmp);
        localStorage.setItem('cart', JSON.stringify([...tmp]));
        // listProduct[index].amount = amount ;
        console.log('list ', listProduct);
        setTotalPrice(showTotalPrice());
    };
    const showTotalPrice = () => {
        let total = 0;
        listProduct.map((item) => {
            total =
                total + item.price * item.amount * (1 - item.discount / 100);
        });
        return total;
    };

    const findIndex = (id) => {
        let index = -1;
        listProduct.map((item, i) => {
            if (item.id === id) {
                index = i;
            }
        });
        return index;
    };

    const handleDelete = (id) => {
        // console.log("id", id);
        let tmp = listProduct.map((item) => item);
        let index = findIndex(id);
        if (index !== -1) {
            tmp.splice(index, 1);
        }
        console.log('tmp ', tmp);
        setListProduct(tmp);
        localStorage.setItem('cart', JSON.stringify([...tmp]));
    };

    const onSubmit = () => {
        let bill_items = [];
        bill_items = listProduct.map((item) => {
            return {
                product_id: item.id,
                amount: item.amount,
                price: item.price,
            };
        });

        let data = {
            total_price: totalPrice,
            discount: 0,
            bill_note: null,
            status: 1,
            customer_id: localStorage.getItem('userId'),
            number_of_product: listProduct.length,
            bill_items: bill_items,
        };

        // console.log("submit ", data)

        Axios.post(`/api/bill/upload`, data, {
            headers: { Authorization: token },
        })
            .then((res) => {
                console.log('res', res.data);
                localStorage.removeItem('cart');
                notification.success({
                    message: `Đặt hàng thành công!`,
                    style: {
                        borderRadius: 15,
                        backgroundColor: '#b7eb8f',
                    },
                    duration: 2,
                    placement: 'bottomRight',
                });
                history.push('/user');
            })
            .catch((err) => {
                notification.error({
                    message: `Đặt hàng thất bại!`,
                    style: {
                        borderRadius: 15,
                        backgroundColor: '#fff2f0',
                    },
                    duration: 2,
                    placement: 'bottomRight',
                });
            });
    };
    return (
        <Container>
            <div className='cart'>
                <h2>Giỏ hàng</h2>
                <div className='cart-item'>
                    <Row className='detail-item'>
                        <Col span={2}>Sản phẩm</Col>
                        <Col span={4}> </Col>
                        <Col span={4}>Khuyến mãi</Col>
                        <Col span={4}>Giá </Col>
                        <Col span={4}>
                            <div>Số lượng</div>{' '}
                        </Col>
                        <Col span={4}>Số tiền</Col>
                    </Row>
                </div>
                {listProduct.map((product, index) => {
                    return (
                        <CartItem
                            key={index}
                            product={product}
                            updateProduct={updateProduct}
                            handleDelete={handleDelete}
                        />
                    );
                })}
                <div className='pay'>
                    <h4>Thanh toán</h4>
                    <Row>
                        <Col className='tth'>
                            <div>
                                Tổng tiền hàng ({listProduct.length} loại hàng):{' '}
                            </div>
                        </Col>
                        <Col span={4}>
                            <div className='total-price'>
                                {currencyFormat(totalPrice)}
                            </div>
                        </Col>
                        <Col>
                            <div className='btnPayment'>
                                <Button
                                    icon={<MdAddShoppingCart />}
                                    style={{ width: 200, marginLeft: 600 }}
                                    onClick={onSubmit}
                                >
                                    Đặt hàng
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
}

export default Cart;
