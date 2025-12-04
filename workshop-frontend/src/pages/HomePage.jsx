import React from 'react';

function HomePage() {
  return (
    <div className="container">
      <div className="hero-section">
        <h1>🎨 The Workshop</h1>
        <p>เรียนรู้และพัฒนาทักษะใหม่ๆ กับเรา</p>
      </div>

      <h2 className="section-title">Workshop ที่กำลังจะมาถึง</h2>

      <div className="workshops-grid">
        <div className="workshop-card">
          <div className="workshop-image">
            <img src="https://via.placeholder.com/400x250" alt="Workshop" />
            <span className="workshop-badge">เปิดรับสมัคร</span>
          </div>
          <div className="workshop-content">
            <h3>Web Development Bootcamp</h3>
            <p className="workshop-description">
              เรียนรู้การสร้างเว็บไซต์ตั้งแต่พื้นฐานจนถึงขั้นสูง
            </p>
            <div className="workshop-footer">
              <span className="workshop-price">฿2,500</span>
              <span className="workshop-date">15 ม.ค. 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;