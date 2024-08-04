import { useState, useEffect } from 'react';
import "./clock.css"

export default function Clock() {

  const [time, setTime] = useState()

  function updateTime() {
    const date = new Date()
    setTime(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)
  }

  // updateTime()

  useEffect(() => {
    const interval = setInterval(updateTime, 500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <div className="clock">
        {time}
      </div >
    </>
  )
}