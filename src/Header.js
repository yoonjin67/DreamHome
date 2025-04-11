// Header.js
import React from 'react';

function Header({ isLoggedIn, userName, onLoginClick, onLogoutClick, onMyPageClick }) {
  return (
    <div style={styles.header}>
      <h1>내 웹사이트</h1>
      <div style={styles.rightArea}>
        {/* 로그인이 안 되었다면 '로그인' 버튼, 되었다면 '마이페이지' 아이콘 + '로그아웃' */}
        {isLoggedIn ? (
          <>
            <span style={{ marginRight: 16 }}>
              환영합니다, {userName}님
            </span>
            <button onClick={onMyPageClick}>마이페이지</button>
            <button onClick={onLogoutClick}>로그아웃</button>
          </>
        ) : (
          <button onClick={onLoginClick}>로그인</button>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#f0f0f0',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightArea: {
    display: 'flex',
    alignItems: 'center',
  },
};

export default Header;
