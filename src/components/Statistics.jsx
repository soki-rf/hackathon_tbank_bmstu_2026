import { useState, useEffect, useMemo } from 'react';
import { Card, Row, Col, Statistic, Typography, Divider, message } from 'antd';
import { ArrowUpOutlined, UserOutlined, ShoppingCartOutlined, DollarOutlined } from '@ant-design/icons';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const { Title, Text } = Typography;

export default function Statistics() {
  const [statsData, setStatsData] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    newUsers: 0
  });
  const [transactionsData, setTransactionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      const partnerLogin = localStorage.getItem('loyalT_login') || 'test_partner';
      const toDate = new Date();
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
      toDate.setMonth(toDate.getMonth() + 1);
      const fromISO = fromDate.toISOString().slice(0, 19);
      const toISO = toDate.toISOString().slice(0, 19);

      try {
        const statsUrl = `https://prowess-grove-enroll.ngrok-free.dev/api/analytics/${partnerLogin}/stats?from=${fromISO}&to=${toISO}`;
        const statsRes = await fetch(statsUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          setStatsData(statsJson);
        }

        const txUrl = `https://prowess-grove-enroll.ngrok-free.dev/api/analytics/transactions?limit=500`;
        const txRes = await fetch(txUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true'
          }
        });

        if (txRes.ok) {
          const txJson = await txRes.json();
          setTransactionsData(txJson);
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

  const chartData = useMemo(() => {
    const grouped = {};
    
    if (!Array.isArray(transactionsData)) return [];

    transactionsData.forEach(tx => {
      const txTime = tx.date || tx.timestamp;
      if (!txTime) return;

      let dateStr = "";

      if (typeof txTime === 'string') {
        dateStr = txTime.split('T')[0];
      } 
      else if (Array.isArray(txTime)) {
        const year = txTime[0];
        const month = String(txTime[1]).padStart(2, '0');
        const day = String(txTime[2]).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } 
      else if (typeof txTime === 'number') {
        dateStr = new Date(txTime).toISOString().split('T')[0];
      } else {
        return; 
      }

      if (!grouped[dateStr]) {
        grouped[dateStr] = { date: dateStr, amount: 0, count: 0 };
      }
      
      grouped[dateStr].amount += Number(tx.amount || 0); 
      grouped[dateStr].count += 1; 
    });

    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactionsData]);

  const totalRevenue = chartData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ВЕРХНИЕ КАРТОЧКИ */}
      <Row gutter={16}>
        <Col span={6}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Выручка" value={totalRevenue} prefix={<DollarOutlined />} styles={{ content: { color: '#ffc107' } }} suffix="₽" />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Транзакции" value={statsData.totalTransactions} prefix={<ShoppingCartOutlined />} styles={{ content: { color: '#3f8600' } }} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Всего клиентов" value={statsData.totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading} style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic title="Новых клиентов" value={statsData.newUsers} prefix={<UserOutlined />} styles={{ content: { color: '#1890ff' } }} />
            <Text type="success" style={{ fontSize: '12px' }}><ArrowUpOutlined /> за последний месяц</Text>
          </Card>
        </Col>
      </Row>

      {/* БЛОК С ГРАФИКАМИ */}
      <Row gutter={16}>
        {/* График выручки */}
        <Col span={12}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Title level={4}>Динамика выручки</Title>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [`${value} ₽`, 'Выручка']} labelFormatter={(label) => `Дата: ${label}`} />
                  <Legend />
                  <Line type="monotone" name="Выручка (₽)" dataKey="amount" stroke="#ffdd2d" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* График транзакций */}
        <Col span={12}>
          <Card style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Title level={4}>Количество транзакций</Title>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [value, 'Транзакции']} labelFormatter={(label) => `Дата: ${label}`} />
                  <Legend />
                  <Bar name="Кол-во транзакций" dataKey="count" fill="#1890ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
