import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    InputNumber,
    Popconfirm,
    Space,
    Table,
    Tag,
    Modal,
    Form,
    Column,
    Select,
    Row,
    Col,
} from 'antd';
import Highlighter from 'react-highlight-words';
import {
    DollarOutlined,
    SearchOutlined,
    CloseSquareOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import jwt from 'jsonwebtoken';
import orderApi from '../api/orderApi';
const { Option } = Select;

function Cart(props) {
    const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [action, setAction] = useState('Sửa thông tin');
    const [editId, setEditId] = useState('');
    const [isCart, setIsCart] = useState(false);
    const [dataMenu, setDataMenu] = useState([1]);
    const [dataOrder, setDataOrder] = useState([]);
    const [userEmail, setUserEmail] = useState(
        JSON.parse(localStorage.getItem('dataUser')).dataUser.email
    );
    const [imageUrl, setImageUrl] = useState('5ff6b831c01d2f12b4752e94');

    useEffect(async () => {
        await getDataOrder();
    }, []);

    const getDataOrder = async () => {
        let res = await orderApi.getOrderByEmail(userEmail);
        console.log(res.data);
        setDataOrder(res.data);
    };

    let searchInput;

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={(node) => {
                        searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{ color: filtered ? '#1890ff' : undefined }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex]
                      .toString()
                      .toLowerCase()
                      .includes(value.toLowerCase())
                : '',
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const columnsRow = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Loại',
            dataIndex: 'typeName',
            key: 'typeName',
            sorter: (a, b) => a.typeName.length - b.typeName.length,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price?.length - b.price?.length,
        },
        {
            title: 'Số lượng',
            dataIndex: 'amount',
            key: 'amount',
            sorter: (a, b) => a.amount?.length - b.amount?.length,
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalProduct',
            key: 'totalProduct',
            sorter: (a, b) => a.totalProduct?.length - b.totalProduct?.length,
        },
    ];

    let dataSourceRow = dataOrder.order?.map((item, index) => {
        return {
            ...item.product,
            amount: item.amount,
            totalProduct: item.amount * item.product.price,
            key: index,
            typeName: item.product.type.name,
        };
    });

    return (
        <>
            <Row justify='center' style={{ marginTop: '100px' }}>
                <Col span='20'>
                    <Table
                        columns={columnsRow}
                        dataSource={dataSourceRow}
                        expandable={{
                            expandedRowRender: (record) => (
                                <p style={{ margin: 0 }}>
                                    <img
                                        src={
                                            'http://localhost:5001/photo/' +
                                            (record.photo || imageUrl)
                                        }
                                        alt='avatar'
                                        style={{ width: '200px' }}
                                    />
                                </p>
                            ),
                            rowExpandable: (record) =>
                                record.name !== 'Not Expandable',
                        }}
                    />
                </Col>
            </Row>
            <Row justify='center' style={{ marginTop: '10px' }}>
                <Col span='8'>
                    <Button>Mua ngay</Button>
                </Col>
            </Row>
        </>
    );
}

Cart.propTypes = {};

export default Cart;
