import React, { Component } from 'react';

import { BackTop } from 'antd';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {} = this.state;
        return (
            <div className='container-fluid'>
                <div className='footer'>
                    <div className='copyright'>
                        Copyright &copy; 2020 - Project III - Fashion Store
                    </div>
                </div>
            </div>
        );
    }
}

export default Footer;
