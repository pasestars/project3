import React, { useState } from "react";
import PropTypes from "prop-types";
import "./LayoutMenu.css";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as Logo } from "../../assets/images/fashionpng.svg";
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from "antd";
import {
  ScheduleOutlined,
  HomeOutlined,
  BarsOutlined,
  TeamOutlined,
  UserOutlined,
  TableOutlined,
  ImportOutlined,
  ExportOutlined,
  ExperimentOutlined,
  BankOutlined,
  TagsOutlined,
  ShopOutlined,
  MenuOutlined,
  DatabaseOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { IconMap } from "antd/lib/result";
import { Link } from "react-router-dom";
import { logoutAction } from "../../redux/actions/authAction";
import jwt from "jsonwebtoken";
import logo from "../../assets/images/logo.png";
import logoFull from "../../assets/images/logoFull.png";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function LayoutMenu(props) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const onCollapse = (collapsed) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const dispatch = useDispatch();

  const menu = (
    <Menu>
      <Menu.Item>{jwt.decode(localStorage.getItem("token")).email}</Menu.Item>
      <Menu.Item onClick={() => dispatch(logoutAction())}>Đăng xuất</Menu.Item>
    </Menu>
  );
  const name = jwt.decode(localStorage.getItem("token")).name;
  const role = jwt.decode(localStorage.getItem("token")).role;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        {/* <div className='logo' /> */}
        <div
          className="logo"
          style={collapsed ? { padding: "4px" } : { padding: "16px" }}
        >
          <Logo height={collapsed ? "50px" : "100px"} />
        </div>
        <Menu theme="dark" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            {/* <Link to="/home">Home</Link> */}
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<ScheduleOutlined />}
            disabled={role == "inventoryManager" ? true : false}
          >
            {/* <Link to="/order">Order Manager</Link> */}
            <Link to="/order">Quản lý đơn hàng</Link>
          </Menu.Item>
          {/*<Menu.Item*/}
          {/*  key="3"*/}
          {/*  icon={<BarsOutlined />}*/}
          {/*  disabled={role == "cashier" ? true : false}*/}
          {/*>*/}
          {/*  /!* <Link to="/product">Product Manager</Link> *!/*/}
          {/*  <Link to="/product">Quản lý sản phẩm</Link>*/}
          {/*</Menu.Item>*/}
          <Menu.Item key="3" icon={<ProfileOutlined />}>
            {/* <Link to="/material">Material Manager</Link> */}
            <Link to="/product">Danh mục sản phẩm</Link>
          </Menu.Item>
          <Menu.Item key="10" icon={<TagsOutlined />}>
            {/* <Link to="/material/import">Import Material</Link> */}
            <Link to="/typeProduct">Quản lý loại sản phẩm</Link>
          </Menu.Item>

          <Menu.Item
            key="8"
            icon={<TeamOutlined />}
            disabled={role == "admin" ? false : true}
          >
            <Link to="/member">Quản lý thành viên</Link>
          </Menu.Item>
          <Menu.Item key="9" icon={<UserOutlined />}>
            <Link to="/account">Quản lý tài khoản</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="header">
          <div className="header-avatar">
            <Dropdown overlay={menu} placement="bottomRight" arrow>
              <Button
                shape="circle"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<UserOutlined />}
              ></Button>
            </Dropdown>
          </div>
          <div className="header-name">{name}</div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}></Breadcrumb>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360, height: "100%" }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            color: "#ffffff",
            backgroundColor: "#333333",
          }}
        >
          QUẢN LÝ CỬA HÀNG THỜI TRANG
        </Footer>
      </Layout>
    </Layout>
  );
}

LayoutMenu.propTypes = {};

export default LayoutMenu;
