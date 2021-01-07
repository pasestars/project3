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
  Upload,
  message,
  Col,
  Row,
} from "antd";
import jwt from "jsonwebtoken";
import {
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import typeProductApi from "../../api/typeProductApi";
import accountApi from "../../api/accountApi";
const { Option } = Select;

function AccountManager(props) {
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [imageUrl, setImageUrl] = useState("5ff6b831c01d2f12b4752e94");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "http://localhost:5001/photo/5ff6b831c01d2f12b4752e94",
    },
  ]);
  const [data, setData] = useState({});
  const [userEmail, setUserEmail] = useState(
    jwt.decode(localStorage.getItem("token")).email
  );

  const [form] = Form.useForm();
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChangeAvatar = (info) => {
    setFileList(info.fileList);
    if (info.file.status === "uploading") {
      setLoadingPhoto(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setImageUrl(info.file.response.photo);
        setLoadingPhoto(false);
      });
      console.log(info.file.response);
    }
  };

  const uploadButton = (
    <div>
      {loadingPhoto ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFill = (data) => {
    form.setFieldsValue(data);
    if (data.photo) setImageUrl(data.photo);
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
    await accountApi.editUserByEmail(userEmail, {
      ...values,
      photo: imageUrl,
    });
  };

  useEffect(async () => {
    // setData(fakeData);
    await getData();
  }, []);

  const getData = async () => {
    let res = await accountApi.getUserByEmail(userEmail);
    console.log(res);
    if (res.photo) setImageUrl(res.photo);
    setData(res);
    onFill(res[0]);
  };

  return (
    <Row justify="center">
      <Col span="12">
        <Form
          {...layout}
          name="nest-messages"
          onFinish={onFinishModal}
          validateMessages={validateMessages}
          form={form}
        >
          <Form.Item name={"name"} label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name={"email"} label="Email" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name={"phone"} label="Điện thoại">
            <Input />
          </Form.Item>
          <Form.Item name={"password"} label="Mật khẩu">
            <Input.Password placeholder="input password" disabled />
          </Form.Item>
          <Form.Item name={"address"} disable label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name={"role"} disable label="Quyền">
            <Input disabled />
          </Form.Item>
          <Form.Item name={"photo"} label="Ảnh đại diện">
            <Upload
              name="photo"
              listType="picture-card"
              className="avatar-uploader"
              fileList={fileList}
              showUploadList={false}
              action="http://localhost:5001/uploadphoto"
              beforeUpload={beforeUpload}
              onChange={handleChangeAvatar}
            >
              {imageUrl ? (
                <img
                  src={
                    "http://localhost:5001/photo/" + (data.photo || imageUrl)
                  }
                  alt="avatar"
                  style={{ width: "100%" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

AccountManager.propTypes = {};

export default AccountManager;
