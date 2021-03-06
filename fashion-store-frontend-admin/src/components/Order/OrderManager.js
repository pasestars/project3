import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
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
} from "antd";
import orderApi from "../../api/orderApi";
import tableApi from "../../api/tableApi";
import productApi from "../../api/productApi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Highlighter from "react-highlight-words";
import {
  DollarOutlined,
  SearchOutlined,
  CloseSquareOutlined,
  CheckOutlined,
} from "@ant-design/icons";

import TextArea from "antd/lib/input/TextArea";
import { Checkbox } from "antd";
import jwt from "jsonwebtoken";
const { Option } = Select;

// function onChange(e) {
//   console.log(`checked = ${e.target.checked}`);
// }
//
// ReactDOM.render(<Checkbox onChange={onChange}>Checkbox</Checkbox>, mountNode);
function OrderManager(props) {
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [action, setAction] = useState("Sửa thông tin");
  const [editId, setEditId] = useState("");
  const [isCart, setIsCart] = useState(false);
  const [dataMenu, setDataMenu] = useState([1]);
  const [dataProduct, setDataProduct] = useState([]);
  const [userEmail, setUserEmail] = useState(
    jwt.decode(localStorage.getItem("token")).email
  );

  const [form] = Form.useForm();

  const onFill = (data) => {
    form.setFieldsValue(data[0]);
    setEditId(data[0]._id);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: "${label} is required!",
    types: {
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const onFinishModal = async (values) => {
    console.log(values);
    let order = Object.keys(values).map((item, index) => {
      return values[item];
    });
    console.log(order);
    let newOrder = [];
    for (let i = 0; i < order.length; i += 2) {
      newOrder.push({ product: order[i], amount: order[i + 1] });
    }
    console.log(newOrder);
    let newValues = { ...values, order: [...newOrder], email: userEmail };
    console.log(newValues);
    // if (isCart == false) {
    //   newValues = { ...values, email: userEmail, order: [...newOrder] };
    // }
    // console.log(isCart);
    if (action === "Sửa thông tin") {
      await orderApi.editOrderById(editId, values);
    } else {
      await orderApi.createOrderEmail(newValues);
    }
    await getData();
    setIsModalVisible(false);
  };

  const showModal = (type) => {
    setAction(type);
    setIsModalVisible(true);
  };

  const handleOkModal = () => {
    setIsModalVisible(false);
  };

  const handleCancelModal = () => {
    setIsModalVisible(false);
  };

  const onChangeCheckBoxCart = (e) => {
    setIsCart(e.target.checked);
  };
  const addMenu = () => {
    let newDataMenu = [...dataMenu];
    newDataMenu.push(1);
    console.log(dataMenu);
    console.log(dataMenu);
    setDataMenu((prev) => {
      return [...prev, 1];
    });
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
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
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
    setSearchText("");
  };

  useEffect(async () => {
    // setData(fakeData);
    await getData();
    await getDataProduct();
  }, []);

  const getDataProduct = async () => {
    let res = await productApi.getAllProduct();

    console.log(res);
    setDataProduct(res);
  };

  const getData = async () => {
    let res = await orderApi.getAllOrder();
    let result = [];
    for (let index = 0; index < res.length; index++) {
      const element = res[index];
      let r = {
        _id: element._id,
        status: element.status,
        user: element.user !== null ? element.user?.name : "",
        totalPrice: element.totalPrice,
        key: index,
      };
      result.push(r);
    }
    let resData = res.map((item, index) => {
      return {
        ...item,
        user: item.user?.name,
        key: index,
        userId: item.user?._id,
      };
    });

    console.log(res);
    setData(resData);
  };

  const handlePayMoney = async (record, status) => {
    const res = await orderApi.payOrderById(record._id, status);

    console.log(res);
    await getData();
  };

  const handleDelete = async (id) => {
    console.log(id);
    const res = await orderApi.deleteOrderById(id);
    console.log(res);
    await getData();
  };

  const columnsRow = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Loại",
      dataIndex: "typeName",
      key: "typeName",
      sorter: (a, b) => a.typeName.length - b.typeName.length,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price?.length - b.price?.length,
    },
    {
      title: "Số lượng",
      dataIndex: "amount",
      key: "amount",
      sorter: (a, b) => a.amount?.length - b.amount?.length,
    },
    {
      title: "Thành tiền",
      dataIndex: "totalProduct",
      key: "totalProduct",
      sorter: (a, b) => a.totalProduct?.length - b.totalProduct?.length,
    },
  ];

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "user",
      sorter: (a, b) => a.user?.length - b.user?.length,
      ...getColumnSearchProps("user"),
    },

    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.price?.length - b.price?.length,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Đã xác nhận",
          value: "confirmed",
        },
        {
          text: "Chưa xác nhận",
          value: "unconfirmed",
        },
        {
          text: "Đã kết thúc",
          value: "finished",
        },
        {
          text: "Đã hoàn thành",
          value: "completed",
        },
        {
          text: "Trong giỏ hàng",
          value: "cart",
        },
      ],
      onFilter: (value, record) => record.status === value,
      sorter: (a, b) => a.status?.length - b.status?.length,
      render: (status) => {
        let color;
        let valueVN;
        switch (status) {
          case "unconfirmed":
            color = "red";
            valueVN = "Chưa xác nhận";
            break;
          case "confirmed":
            color = "green";
            valueVN = "Đã xác nhận";
            break;
          case "finished":
            color = "black";
            valueVN = "Đã kết thúc";
            break;
          case "completed":
            color = "blue";
            valueVN = "Đã hoàn thành";
            break;
          case "cart":
            color = "red";
            valueVN = "Trong giỏ hàng";
            break;
        }
        return (
          <Tag color={color} key={status}>
            {valueVN}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          {/* <a
            onClick={() => {
              onFill(data.filter((item) => item._id === record._id));
              showModal("Sửa thông tin");
            }}
          >
            <DollarOutlined style={{ color: "green", fontSize: "18px" }} />
          </a> */}
          <Popconfirm
            title="Xác nhận đơn hàng?"
            onConfirm={() => handlePayMoney(record, "confirmed")}
          >
            <a>
              <CheckOutlined style={{ color: "green", fontSize: "18px" }} />
            </a>
          </Popconfirm>
          <Popconfirm
            title="Hoàn thành đơn hàng?"
            onConfirm={() => handlePayMoney(record, "completed")}
          >
            <a>
              <DollarOutlined style={{ color: "green", fontSize: "18px" }} />
            </a>
          </Popconfirm>
          <Popconfirm
            title="Xác nhận hủy đơn hàng?"
            onConfirm={() => handlePayMoney(record, "finished")}
          >
            <a>
              <CloseSquareOutlined style={{ color: "red", fontSize: "18px" }} />
            </a>
          </Popconfirm>
          <Popconfirm
            title="Bạn có muốn xóa đơn hàng?"
            onConfirm={() => handleDelete(record._id)}
          >
            <a>
              <RiDeleteBin6Line color={"red"} size={"18px"} />
            </a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
    setPagination(pagination);
  }

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={() => {
            form.resetFields();
            setDataMenu([1]);
            showModal("Thêm đơn");
          }}
          style={{ marginBottom: "16px" }}
        >
          Thêm sản phẩm
        </Button>
        <Modal
          footer={null}
          title={action}
          visible={isModalVisible}
          onOk={handleOkModal}
          onCancel={handleCancelModal}
        >
          <Form
            {...layout}
            name="nest-messages"
            onFinish={onFinishModal}
            validateMessages={validateMessages}
            form={form}
          >
            {/* <Form.Item
              name={"isCart"}
              label=""
              rules={[{ required: false }]}
            >
              <Checkbox onChange={(e) => onChangeCheckBoxCart(e)}>
                Khách hàng đã đặt bàn trước
              </Checkbox>
            </Form.Item> */}
            {/* {!isCart ? (
              <React.Fragment>
                
                <Form.Item name={"table"} label="Bàn">
                  <Select
                    placeholder="Chọn bàn chưa đặt"
                    // onChange={onRoleChange}
                    allowClear
                  >
                    
                    {dataTable.map((item, index) => {
                      return <Option value={item._id}>{item.name}</Option>;
                    })}
                  </Select>
                </Form.Item>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Form.Item
                  name={"email"}
                  label="Email khách hàng"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </React.Fragment>
            )} */}
            {dataMenu.map((item, index) => {
              return (
                <div
                  key={index}
                  className="itemMenu"
                  style={{
                    borderBottom: "1px solid #000",
                    padding: "8px 0px",
                    marginBottom: "8px",
                  }}
                >
                  <Form.Item
                    key={index}
                    name={"product." + index}
                    label={
                      "Sản phẩm" +
                      (dataMenu.length > 1 ? " " + (index + 1) : "")
                    }
                  >
                    <Select
                      placeholder="Thêm sản phẩm"
                      // onChange={onRoleChange}
                      allowClear
                    >
                      {dataProduct.map((item, index) => {
                        return <Option value={item._id}>{item.name}</Option>;
                      })}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={"amount." + index}
                    label="Số lượng"
                    rules={[{ number: "range", min: 1 }]}
                  >
                    <Input type="number" min="1" />
                  </Form.Item>
                </div>
              );
            })}
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button htmlType="button" onClick={() => addMenu()}>
                Thêm đơn hàng
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          pagination={pagination}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => {
              let dataSourceRow = record.order.map((item, index) => {
                return {
                  ...item.product,
                  amount: item.amount,
                  totalProduct: item.amount * item.product.price,
                  key: index,
                  typeName: item.product.type.name,
                };
              });
              return <Table columns={columnsRow} dataSource={dataSourceRow} />;
            },
            rowExpandable: (record) => record.name !== "Not Expandable",
          }}
        />
      </div>
    </>
  );
}

OrderManager.propTypes = {};

export default OrderManager;
