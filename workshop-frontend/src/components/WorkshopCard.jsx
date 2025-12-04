import React from 'react';
import { useNavigate } from 'react-router-dom';

function WorkshopCard({ workshop }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/workshop/${workshop.id}`);
  };

  return (
    <div className="workshop-card" onClick={handleClick}>
      <div className="workshop-image">
        <img
          src={`https://picsum.photos/seed/${workshop.id}/400/250`}
          alt={workshop.title}
        />
        <div className="workshop-badge">
          {workshop.remainingSeats} / {workshop.totalSeats} ที่ว่าง
        </div>
      </div>

      <div className="workshop-content">
        <h3>{workshop.title}</h3>
        <p className="workshop-description">{workshop.description}</p>

        <div className="workshop-footer">
          <div className="workshop-price">
            ฿{workshop.price.toLocaleString()}
          </div>
          <div className="workshop-date">
            📅 {new Date(workshop.scheduledAt).toLocaleDateString('th-TH')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkshopCard;