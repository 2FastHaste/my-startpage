import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Europe/Brussels'
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedTime = formatter.format(time);

  const [hoursString, minutesString, secondsString] = formattedTime.split(':');
  const hours = parseInt(hoursString, 10);
  const minutes = parseInt(minutesString, 10);
  const seconds = parseInt(secondsString, 10);

  const minuteAngle = minutes * 6 + seconds / 10;
  const hourAngle = ((hours % 12) * 30) + (minutes / 2);
  
  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  
  return (
    <div className="time-info-card">
      <div className="time-info-card__clock-face">
        <span className="border" />
        <span className="hour" style={{ '--angle': `${hourAngle}deg` }} />
        <span className="minute" style={{ '--angle': `${minuteAngle}deg` }} />
        <span className="dot" />
      </div>
      <div id="digital-clock">{`${formattedHours}:${formattedMinutes}`}</div>
    </div>
  );
};

export default Clock;