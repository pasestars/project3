import axiosClient from "./axiosClient";
import { notification } from "antd";

const accountApi = {
  getUserByEmail: async (email) => {
    try {
      const response = await axiosClient.get(`api/useremail/${email}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteUserByEmail: async (email) => {
    try {
      const response = await axiosClient.delete(`api/useremail/${email}`);
      notification.success({ message: "Xóa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
  editOrderByEmail: async (email, data) => {
    try {
      const response = await axiosClient.patch(`api/useremail/${email}`, data);
      notification.success({ message: "Sửa thành công!" });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default accountApi;
