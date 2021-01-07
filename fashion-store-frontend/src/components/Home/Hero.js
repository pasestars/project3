import React, { Component } from 'react';

import { Button } from 'antd';

import { Carousel } from 'antd';
import { Link, NavLink } from 'react-router-dom';

class Hero extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {} = this.state;
        return (
            <div id='trang-chu' className='heroBlock'>
                <Carousel>
                    <div className='container-fluid'>
                        <div className='content'>
                            <h3 style={{ color: 'black' }}>
                                Fashion Store - Không chỉ là thời trang, mà còn
                                là bản chất!
                            </h3>
                            <div className='btnHolder'>
                                <NavLink to={'/danh-muc/loai'}>
                                    <Button size='large'>Mua hàng</Button>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </Carousel>
            </div>
        );
    }
}

export default Hero;
