import React, { useState } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Select, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'

function SystemUser() {
  const [visible, setVisible] = useState(false)
  const [roleVisible, setRoleVisible] = useState(false)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, username: 'admin', name: '超级管理员', role: 'super_admin', email: 'admin@dtci.com', status: true, lastLogin: '2024-05-20 10:30' },
    { id: 2, username: 'editor', name: '内容编辑', role: 'editor', email: 'editor@dtci.com', status: true, lastLogin: '2024-05-19 14:20' },
    { id: 3, username: 'operator', name: '运营人员', role: 'operator', email: 'operator@dtci.com', status: true, lastLogin: '2024-05-18 09:15' },
    { id: 4, username: 'viewer', name: '查看者', role: 'viewer', email: 'viewer@dtci.com', status: false, lastLogin: '2024-05-15 16:40' }
  ]

  const roleData = [
    { id: 1, name: '超级管理员', description: '拥有所有权限', count: 1 },
    { id: 2, name: '内容编辑', description: '负责内容管理', count: 2 },
    { id: 3, name: '运营人员', description: '负责日常运营', count: 3 },
    { id: 4, name: '查看者', description: '仅可查看数据', count: 1 }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          super_admin: { label: '超级管理员', color: 'red' },
          editor: { label: '内容编辑', color: 'blue' },
          operator: { label: '运营人员', color: 'green' },
          viewer: { label: '查看者', color: 'default' }
        }
        return <Tag color={roleMap[role].color}>{roleMap[role].label}</Tag>
      }
    },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
        </Tag>
      )
    },
    { title: '最后登录', dataIndex: 'lastLogin', key: 'lastLogin' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<LockOutlined />} onClick={() => handleResetPassword(record)}>重置密码</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    }
  ]

  const roleColumns = [
    { title: '角色ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '人数', dataIndex: 'count', key: 'count' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      )
    }
  ]

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setVisible(true)
  }

  const handleResetPassword = (record) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置 ${record.name} 的密码吗？`,
      onOk: () => {
        message.success('密码已重置为: 123456')
      }
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">系统用户</h1>
        <Space>
          <Button onClick={() => setRoleVisible(true)}>角色管理</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>添加用户</Button>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="添加用户"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => { setVisible(false); message.success('添加成功'); }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Select.Option value="super_admin">超级管理员</Select.Option>
              <Select.Option value="editor">内容编辑</Select.Option>
              <Select.Option value="operator">运营人员</Select.Option>
              <Select.Option value="viewer">查看者</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="初始密码" name="password" initialValue="123456">
            <Input.Password disabled />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="角色管理"
        open={roleVisible}
        onCancel={() => setRoleVisible(false)}
        footer={[
          <Button key="add" type="primary" onClick={() => message.info('添加角色')}>添加角色</Button>,
          <Button key="close" onClick={() => setRoleVisible(false)}>关闭</Button>
        ]}
      >
        <Table columns={roleColumns} dataSource={roleData} rowKey="id" pagination={false} />
      </Modal>
    </div>
  )
}

export default SystemUser
