import React from 'react'
import { Layout, Dropdown, Avatar, Space } from 'antd'
import { BellOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import request from '../utils/request'
import './Header.css'

const { Header: AntHeader } = Layout

function Header() {
  const navigate = useNavigate()
  const [pendingCount, setPendingCount] = React.useState(0)

  React.useEffect(() => {
    fetchPendingCount()
    const timer = setInterval(fetchPendingCount, 60000)
    return () => clearInterval(timer)
  }, [])

  const fetchPendingCount = async () => {
    try {
      const res = await request.get('/feedbacks/pending-count')
      setPendingCount(res)
    } catch (err) {
      console.error('Failed to fetch pending count:', err)
    }
  }

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

  const [adminName, setAdminName] = React.useState('管理员')

  React.useEffect(() => {
    const handleProfileUpdate = (e) => {
      setAdminName(e.detail.name)
    }
    window.addEventListener('admin_profile_updated', handleProfileUpdate)
    
    const adminJson = localStorage.getItem('admin_user')
    if (adminJson) {
      const admin = JSON.parse(adminJson)
      setAdminName(admin.name || admin.username)
    }

    return () => window.removeEventListener('admin_profile_updated', handleProfileUpdate)
  }, [])

  const handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('admin_user')
      navigate('/login')
    } else if (key === 'profile') {
      navigate('/settings/profile')
    }
  }

  return (
    <AntHeader className="header">
      <div className="header-left">
        {/* 已按需移除标题 */}
      </div>
      <div className="header-right">
        <div className="header-notification" onClick={() => navigate('/feedback/feedback-list')}>
          <BellOutlined className="notification-icon" />
          {pendingCount > 0 && <span className="notification-badge">{pendingCount}</span>}
        </div>
        <Dropdown menu={{ items: userMenuItems, onClick: handleMenuClick }} placement="bottomRight">
          <Space className="header-user">
            <Avatar size={36} icon={<UserOutlined />} />
            <span className="username">{adminName}</span>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  )
}

export default Header
