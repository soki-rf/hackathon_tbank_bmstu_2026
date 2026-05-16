import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Typography, Divider, message, Table, Tag } from 'antd';
import { ArrowUpOutlined, UserOutlined, ShoppingCartOutlined, ShopOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// БАЗОВЫЙ АДРЕС (вставь IP бэкендера)
const API_BASE = 'https://prowess-grove-enroll.ngrok-free.dev'; 

export default function Statistics() {
  const [statsData, setStatsData] = useState({
    totalClients: 0,
    totalTransactions: 0,
    newClients: 0
  });
  
  const [clientsData, setClientsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Пустой массив зависимостей: вызываем один раз при открытии вкладки
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Запрос сводной статистики (уточни точный эндпоинт, например /stats)
        const statsRes = await fetch(`${API_BASE}`);
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setStatsData(statsJson); 
        }

        // 2. Запрос списка клиентов (уточни точный эндпоинт, например /clients)
        const clientsRes = await fetch(`${API_BASE}`);
        if (clientsRes.ok) {
          const clientsJson = await clientsRes.json();
          setClientsData(clientsJson); 
        }
      } catch (error) {
        console.error('Ошибка:', error);
        message.error('Не удалось загрузить данные с сервера');
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
