import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoyaltyConstructor from '../components/LoyaltyConstructor';
import Statistics from '../components/Statistics';
import { Layout, Menu, Avatar, Space, Typography, Button } from 'antd';
import { AppstoreOutlined, PieChartOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Header, Sider, Content } = Layout;

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('1'); 
  const [username, setUsername] = useState('Партнер'); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedLogin = localStorage.getItem('loyalT_login');
    
    if (savedLogin) {
      setUsername(savedLogin); 
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loyalT_partnerId');
    localStorage.removeItem('loyalT_login');
    
    navigate('/login');
  };

  const menuItems = [
    { key: '1', icon: <SettingOutlined />, label: 'Конструктор' },
    { key: '2', icon: <PieChartOutlined />, label: 'Статистика' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" theme="light" style={{ boxShadow: '2px 0 8px rgba(0,0,0,0.05)' }}>
        <div style={{ height: '32px', margin: '16px', background: '#ffdd2d', borderRadius: '6px', textAlign: 'center', lineHeight: '32px', fontWeight: 'bold', color: '#000' }}>
          LoyalT
        </div>
        <Menu theme="light" mode="inline" selectedKeys={[activeTab]} items={menuItems} onSelect={(e) => setActiveTab(e.key)} />
      </Sider>
      
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <Title level={4} style={{ margin: 0 }}>Личный кабинет партнера</Title>
          <Space>
            {/*  Заглавные буквы*/}
            <Avatar style={{ backgroundColor: '#ffdd2d', color: '#000' }}>
              {username.substring(0, 2).toUpperCase()}
            </Avatar>
            
            {/*  реальный логин */}
            <Text strong>{username}</Text>
            
            {/* Кнопка выхода */}
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout}>
              Выход
            </Button>
          </Space>
        </Header>
        
        <Content style={{ margin: '24px' }}>
          {activeTab === '1' && <LoyaltyConstructor />}
          {activeTab === '2' && <Statistics />}
        </Content>
      </Layout>
    </Layout>
  );
}
