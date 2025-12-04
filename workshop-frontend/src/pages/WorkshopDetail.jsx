import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function WorkshopDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="workshop-detail-page">
      <div className="detail-hero">
        <img
          src="https://via.placeholder.com/1200x400"
          alt="Workshop"
          className="detail-hero-image"
        />
        <div className="detail-overlay"></div>
      </div>

      <div className="container detail-content">
        <h1>Web Development Bootcamp</h1>
        <p className="detail-description">
          เรียนรู้การพัฒนาเว็บไซต์แบบครบวงจร ตั้งแต่ Frontend, Backend จนถึง Database
        </p>

        <div className="detail-info-grid">
          <div className="info-card">
            <span className="info-icon">📅</span>
            <div>
              <div className="info-label">วันที่</div>
              <div className="info-value">15 ม.ค. 2025</div>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">⏰</span>
            <div>
              <div className="info-label">เวลา</div>
              <div className="info-value">09:00 - 17:00</div>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">👥</span>
            <div>
              <div className="info-label">จำนวนที่นั่ง</div>
              <div className="info-value">30 ที่นั่ง</div>
            </div>
          </div>

          <div className="info-card">
            <span className="info-icon">💰</span>
            <div>
              <div className="info-label">ราคา</div>
              <div className="info-value">฿2,500</div>
            </div>
          </div>
        </div>

        <button
          className="book-now-button"
          onClick={() => navigate(`/seats/${id}`)}
        >
          จองที่นั่งเลย
        </button>
      </div>
    </div>
  );
}

export default WorkshopDetail;