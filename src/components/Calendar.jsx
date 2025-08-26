import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    renderCalendar();
  }, [currentDate]);

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day empty-day" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
      days.push(
        <div key={i} className={`day ${isToday ? 'today' : ''}`}>
          {i}
        </div>
      );
    }
    setCalendarDays(days);
  };

  const getMonthName = (monthIndex) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };

  const handlePrevMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  return (
    <section className="card calendar-card">
       
      <div className="calendar-container">
        <header className="calendar-header">
          <button id="prev-month-btn" className="nav-btn" onClick={handlePrevMonth}>
            &lt;
          </button>
          <div className="month-display">
            <span id="month-name">{getMonthName(currentDate.getMonth())}</span>
            <span id="year">{currentDate.getFullYear()}</span>
          </div>
          <button id="next-month-btn" className="nav-btn" onClick={handleNextMonth}>
            &gt;
          </button>
        </header>
        <div className="calendar-grid">
          <div className="day-of-week">Mon</div>
          <div className="day-of-week">Tue</div>
          <div className="day-of-week">Wed</div>
          <div className="day-of-week">Thu</div>
          <div className="day-of-week">Fri</div>
          <div className="day-of-week">Sat</div>
          <div className="day-of-week">Sun</div>
        </div>
        <div id="calendar-days">{calendarDays}</div>
      </div>
    </section>
  );
};

export default Calendar;