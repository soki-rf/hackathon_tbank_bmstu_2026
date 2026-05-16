
import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, InputNumber } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Option } = Select;

// Обязательно вставь IP бэкендера
const API_BASE = 'https://prowess-grove-enroll.ngrok-free.dev'; 

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [programType, setProgramType] = useState('CASHBACK');

  const onFinish = async (values) => {
    // Упаковываем данные ровно в тот JSON, который ты скинул
    const payload = {
      partnerID: values.partnerID,
      type: values.type,
      value: values.type === 'CASHBACK' ? values.cashbackPercent : values.stampsCount
    };

    console.log('Отправляем на вход:', payload);
    setLoading(true);

    try {
      // Уточни у бэкендеров точный URL для этого стартового запроса (например, /auth или /loyalty)
      const response = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        message.success('Программа создана, успешный вход!');
        // Перекидываем в личный кабинет
        navigate('/dashboard'); 
      } else {
        message.error(`Ошибка сервера: ${response.status}`);
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      message.error('Бэкенд недоступен. Проверьте сервер и CORS!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3}>Т-Лояльность <span style={{ color: '#ffdd2d' }}>●</span></Title>
          <p style={{ color: 'gray' }}>Быстрый старт партнера</p>
        </div>
        
        <Form 
          name="login" 
          onFinish={onFinish} 
          layout="vertical"
          initialValues={{ type: 'CASHBACK', cashbackPercent: 5 }}
        >
          {/* Поле ID Партнера вместо логина */}
          <Form.Item name="partnerID" label="ID Партнера" rules={[{ required: true, message: 'Введите ваш ID!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Например: 1" size="large" />
          </Form.Item>

          {/* Выбор типа программы прямо на входе */}
          <Form.Item name="type" label="Тип программы лояльности">
            <Select size="large" onChange={(value) => setProgramType(value)}>
              <Option value="CASHBACK">Кэшбэк (возврат процента)</Option>
              <Option value="STAMP_CARD">Штампики (N-я покупка в подарок)</Option>
            </Select>
          </Form.Item>

          {/* Динамическое поле значения */}
          {programType === 'CASHBACK' && (
            <Form.Item name="cashbackPercent" label="Процент кэшбэка (%)" rules={[{ required: true }]}>
              <InputNumber min={1} max={100} size="large" style={{ width: '100%' }} />
            </Form.Item>
          )}

          {programType === 'STAMP_CARD' && (
            <Form.Item name="stampsCount" label="Количество покупок для подарка" rules={[{ required: true }]}>
              <InputNumber min={2} max={20} size="large" style={{ width: '100%' }} />
            </Form.Item>
          )}
          
          <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block
              loading={loading}
              style={{ background: '#ffdd2d', color: '#000', border: 'none', fontWeight: 'bold' }}
            >
              {loading ? 'Отправка...' : 'Войти и создать'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

