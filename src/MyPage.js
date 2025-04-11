// MyPage.js
import React, { useEffect, useState } from 'react';
import { fetchMyPage } from './api';

function MyPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchMyPage(token).then((res) => {
      if (!res.success) {
        setError(res.message || '마이페이지 정보를 불러오지 못했습니다.');
      } else {
        setData(res.data);
      }
    });
  }, []);

  if (error) {
    return <p style={{ color: 'red' }}>마이페이지 오류: {error}</p>;
  }
  if (!data) {
    return <p>로딩 중...</p>;
  }

  return (
    <div>
      <h2>마이페이지</h2>
      <p>아이디: {data.userId}</p>
      <p>이름: {data.userName}</p>
      <p>{data.msg}</p>
    </div>
  );
}

export default MyPage;
