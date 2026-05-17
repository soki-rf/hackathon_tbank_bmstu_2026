import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, InputNumber, Divider } from 'antd';
import { GiftOutlined, UserOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

//const API_BASE = 'https://195.19.42.196:8085/api/partners'
const API_BASE = 'https://prowess-grove-enroll.ngrok-free.dev/api/partners';
//const API_BASE = 'https://paralysis-phoenix-siren.ngrok-free.dev/api/partners'; 

export default function LoyaltyConstructor() {
  const [programType, setProgramType] = useState('CASHBACK');
  const [loading, setLoading] = useState(false); 

  const onFinish = async (values) => {
    const finalValue = values.type === 'CASHBACK' ? values.cashbackPercent : values.stampsCount;

    const payload = {
      id: values.id, 
      type: values.type, 
      value: finalValue
    };

    setLoading(true);

    try {
      const url = `${API_BASE}`; 

      const response = await fetch(url, {
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json', 
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify(payload) 
      });

      if (response.ok) {
        message.success('Программа лояльности успешно сохранена!');
      } else {
        message.error(`Ошибка сервера: ${response.status}`);
      }
    } catch (error) {
      message.error('Не удалось подключиться к бэкенду.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Card style={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <Title level={3}><GiftOutlined style={{ color: '#ffdd2d' }} /> Настройка программы</Title>
      <Text type="secondary">Создайте программу лояльности и отправьте на сервер.</Text>
      <Divider />

      <Form 
        layout="vertical" 
        onFinish={onFinish} 
        initialValues={{ type: 'CASHBACK', cashbackPercent: 5 }}
      >
        {/* поле partnerID */}
        <Form.Item name="id" label="ID Партнера" rules={[{ required: true, message: 'Укажите ID партнера' }]}>
          <Input prefix={<UserOutlined />} placeholder="Например: 1" size="large" />
        </Form.Item>
        
        <Form.Item name="type" label="Тип программы">
          <Select size="large" onChange={(value) => setProgramType(value)}>
            <Option value="CASHBACK">Кэшбэк (возврат процента)</Option>
            <Option value="STAMP_CARD">Штампики (N-я покупка в подарок)</Option>
          </Select>
        </Form.Item>

        {programType === 'CASHBACK' && (
          <Form.Item name="cashbackPercent" label="Процент кэшбэка (%)" rules={[{ required: true }]}>
            <InputNumber min={1} max={100} size="large" style={{ width: '100%' }} />
          </Form.Item>
        )}

        {programType === 'STAMP_CARD' && (
          <Form.Item name="stampsCount" label="Количество покупок для подарка" rules={[{ required: true }]}>
            <InputNumber min={2} max={5555} size="large" style={{ width: '100%' }} />
          </Form.Item>
        )}

        <Form.Item style={{ marginTop: '24px' }}>
          <Button type="primary" htmlType="submit" size="large" loading={loading} style={{ background: '#ffdd2d', color: '#000', border: 'none', fontWeight: 'bold' }}>
            {loading ? 'Отправка...' : 'Отправить на сервер'}
          </Button>
        </Form.Item>
        
      </Form>
    </Card>
  );
}
