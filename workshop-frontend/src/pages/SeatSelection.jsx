import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 10;

  const toggleSeat = (seat) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  return (
    <div className="seat-selection-page">
      <div className="container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← กลับ
        </button>

        <div className="seat-header">
          <h1>เลือกที่นั่งของคุณ</h1>
          <p>คลิกที่ที่นั่งเพื่อเลือก</p>
        </div>

        <div className="screen">หน้าเวที</div>

        <div className="seats-area">
          {rows.map(row => (
            <div key={row} className="seat-row">
              <span className="row-label">{row}</span>
              <div className="seats-container">
                {[...Array(seatsPerRow)].map((_, index) => {
                  const seatNum = index + 1;
                  const seatId = `${row}${seatNum}`;
                  const isSelected = selectedSeats.includes(seatId);

                  return (
                    <div
                      key={seatId}
                      className={`seat ${isSelected ? 'selected' : 'available'}`}
                      onClick={() => toggleSeat(seatId)}
                    >
                      🪑
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <div className="seat available">🪑</div>
            <span>ว่าง</span>
          </div>
          <div className="legend-item">
            <div className="seat selected">🪑</div>
            <span>เลือกแล้ว</span>
          </div>
          <div className="legend-item">
            <div className="seat booked">🪑</div>
            <span>จองแล้ว</span>
          </div>
        </div>

        {selectedSeats.length > 0 && (
          <div className="booking-summary">
            <div className="summary-info">
              <p>ที่นั่งที่เลือก: <strong>{selectedSeats.join(', ')}</strong></p>
              <p>ราคารวม: <strong>฿{selectedSeats.length * 2500}</strong></p>
            </div>
            <button className="confirm-button">
              ยืนยันการจอง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatSelection;