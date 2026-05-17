import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Divider, message, Table, Tag } from 'antd';
import { ArrowUpOutlined, UserOutlined, ShoppingCartOutlined, ShopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const API_BASE = 'https://prowess-grove-enroll.ngrok-free.dev/api/analytics'; 
//const API_BASE = 'https://paralysis-phoenix-siren.ngrok-free.dev/api/analytics'; 

export default function Statistics() {
  const [statsData, setStatsData] = useState({
    totalClients: 0,
    totalTransactions: 0,
    newClients: 0
  });
  
  const [clientsData, setClientsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      

      const partnerLogin = localStorage.getItem('loyalT_login') || 'test_partner'; 

      const toDate = new Date(); 
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1); 

      const fromISO = fromDate.toISOString().slice(0, 19);
      const toISO = toDate.toISOString().slice(0, 19);

      try {

        const url = `https://prowess-grove-enroll.ngrok-free.dev/api/analytics/${partnerLogin}/stats?from=${fromISO}&to=${toISO}`;

        const statsRes = await fetch(url, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true' 
          }
        });
        
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          console.log('Статистика для', partnerLogin, 'получена:', statsJson); 
          setStatsData(statsJson); 
        } else {
          message.error(`Ошибка сервера: ${statsRes.status}`);
        }

      } catch (error) {
        console.error('Ошибка:', error);
        message.error('Не удалось загрузить аналитику');
      } finally {
        setLoading(false); 
      }
    };

    fetchAllData();
  }, []);

  const columns = [
    {
      title: 'ID Клиента',
      dataIndex: 'clientId',
      key: 'clientId',
      render: (text) => <b>#{text}</b>,
    },
    {
      title: 'Заведение',
      dataIndex: 'partnerName',
      key: 'partnerName',
      render: (text) => <><ShopOutlined /> {text}</>
    },
    {
      title: 'Накоплено',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance, record) => (
        <span style={{ fontWeight: 'bold', color: record.loyaltyType === 'CASHBACK' ? '#3f8600' : '#1890ff' }}>
          {record.loyaltyType === 'CASHBACK' ? `${balance} ₽` : `${balance} шт.`}
        </span>
      ),
    },
    {
      title: 'Программа',
      dataIndex: 'loyaltyType',
      key: 'loyaltyType',
      render: (type) => (
        <Tag color={type === 'CASHBACK' ? 'gold' : 'blue'}>
          {type === 'CASHBACK' ? 'Кэшбэк' : 'Штампы'}
        </Tag>
      ),
    },
    {
      title: 'Прогресс',
      key: 'progress',
      render: (_, record) => (
        <span>{record.currValue} / {record.maxValueOrPercent}</span>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <Row gutter={16}>
        <Col span={8}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Всего транзакций" value={statsData.totalTransactions} prefix={<ShoppingCartOutlined />} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Всего клиентов" value={statsData.totalClients} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Новых клиентов" value={statsData.newClients} prefix={<UserOutlined />} valueStyle={{ color: '#1890ff' }} />
            <Text type="success"><ArrowUpOutlined /> за последний месяц</Text>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <Title level={4}>База клиентов</Title>
        <Divider />
        <Table 
          dataSource={clientsData} 
          columns={columns} 
          rowKey="clientId" 
          loading={loading}
          pagination={{ pageSize: 5 }} 
        />
      </Card>
    </div>
  );
}
