// Login.js
import React, { useState } from 'react';
import { loginApi } from './api';

function Login({ onLoginSuccess, onClose }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 가짜 API 호출
    const res = await loginApi({ userId, password });
    if (res.success) {
      // 토큰 저장
      localStorage.setItem('token', res.token);
      // 상위(App 등)에 성공 알림
      onLoginSuccess?.(res.token, res.userName);
      onClose?.(); // 모달 닫기 or 페이지 이동
    } else {
      setError('로그인 실패: ' + res.message);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>아이디</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">로그인</button>
          <button type="button" onClick={onClose}>취소</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    width: '300px',
    margin: '100px auto',
    backgroundColor: '#fff',
    padding: '20px',
  },
};

export default Login;
