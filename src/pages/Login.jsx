import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

// Замени на IP бэкендера (через ngrok или локальный)
const API_BASE = 'https://prowess-grove-enroll.ngrok-free.dev/api/auth'; 

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' или 'register'

  const onFinish = async (values) => {
    setLoading(true);
    
    // Выбираем правильный эндпоинт в зависимости от вкладки
    const endpoint = activeTab === 'login' ? '/login' : '/register';
    const url = `${API_BASE}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        // Отправляем логин и пароль
        body: JSON.stringify({ 
          username: values.username, 
          password: values.password 
        })
      });

      if (response.ok) {
        // ОЖИДАЕМ, ЧТО БЭКЕНД ВЕРНЕТ JSON ВИДА: { "partnerID": 123 }
        const data = await response.json();
        
        // Сохраняем ID партнера в память браузера!
        localStorage.setItem('loyalT_partnerId', data.partnerID);
        
        message.success(activeTab === 'login' ? 'Успешный вход!' : 'Регистрация прошла успешно!');
        
        // Перекидываем в личный кабинет
        navigate('/dashboard'); 
      } else {
        // Если статус 401 или 400
        message.error(activeTab === 'login' ? 'Неверный логин или пароль' : 'Такой пользователь уже существует');
      }
    } catch (error) {
      console.error(error);
      message.error('Ошибка подключения к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '16px' }}>
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <Title level={3}>LoyalT <span style={{ color: '#ffdd2d' }}>●</span></Title>
        </div>

        {/* Вкладки для переключения между Входом и Регистрацией */}
        <Tabs 
          centered 
          activeKey={activeTab} 
          onChange={(key) => setActiveTab(key)}
          items={[
            { key: 'login', label: 'Вход' },
            { key: 'register', label: 'Регистрация' }
          ]}
        />
        
        <Form name="auth_form" onFinish={onFinish} layout="vertical" style={{ marginTop: '16px' }}>
          <Form.Item 
            name="username" 
            rules={[{ required: true, message: 'Введите логин!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Логин" size="large" />
          </Form.Item>
          
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Введите пароль!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" size="large" />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={loading}
              style={{ background: '#ffdd2d', color: '#000', border: 'none', fontWeight: 'bold' }}
            >
              {activeTab === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}