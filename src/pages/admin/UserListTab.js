import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Space, Button, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const UserListTab = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/user", config);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Full Name", dataIndex: "fullname", key: "fullname" },
  ];

  return (
    <>
      <h2>User List</h2>
      <Table
        dataSource={users}
        columns={columns}
        loading={isLoading}
        rowKey="_id"
      />
    </>
  );
};

export default UserListTab;
