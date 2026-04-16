import React from 'react'
import { Layout, Dropdown, Avatar, Space } from 'antd'
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import './Header.css'

const { Header: AntHeader } = Layout

function Header() {
  const navigate = useNavigate()

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录'
    }
  ]

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      navigate('/login')
    }
  }

  return (
    <AntHeader className="header">
      <div className="header-left">
        {/* 已按需移除标题 */}
      </div>
      <div className="header-right">
        <div className="header-notification">
          <BellOutlined style={{ fontSize: '18px', color: '#666' }} />
          <span className="notification-badge">6</span>
        </div>
        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
          <Space className="header-user">
            <Avatar size={36} icon={<UserOutlined />} />
            <span className="username">管理员</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header
