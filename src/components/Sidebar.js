// src/components/Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar({ items }) {
  return (
    <div className="sidebar">
      <h2>매물 목록</h2>
      {items.length === 0 ? (
        <p>선택한 지역의 매물이 없습니다.</p>
      ) : (
        <ul>
          {items.map((apt, i) => (
            <li key={i} className="sidebar-item">
              <strong>{apt.name}</strong> <br />
              {apt.dong}, {apt.area}㎡, {apt.floor}층 <br />
              💰 {apt.price}만원 <br />
              📅 {apt.year}.{apt.month}.{apt.day}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sidebar;
