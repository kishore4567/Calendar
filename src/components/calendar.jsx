import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./Calendar.css";

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    duration: ""
  });
  const [editIndex, setEditIndex] = useState(null); // Track event being edited

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("calendar-events");
    if (stored) setEvents(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    const { title, date, time, duration } = newEvent;
    if (!title || !date || !time || !duration) {
      alert("All fields required!");
      return;
    }

    if (editIndex !== null) {
      // Edit existing event
      const updated = [...events];
      updated[editIndex] = newEvent;
      setEvents(updated);
      setEditIndex(null);
    } else {
      // Add new event
      setEvents([...events, newEvent]);
    }

    setNewEvent({ title: "", date: "", time: "", duration: "" });
  };

  const handleDelete = (index) => {
    const updated = [...events];
    updated.splice(index, 1);
    setEvents(updated);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewEvent(events[index]);
  };

  const getEventsForDate = (dateStr) =>
    events
      .map((event, index) => ({ ...event, index }))
      .filter((event) => event.date === dateStr);

  // Generate calendar grid
  const startDate = currentMonth.startOf("month").startOf("week");
  const endDate = currentMonth.endOf("month").endOf("week");
  const days = [];
  let date = startDate.clone();

  while (date.isBefore(endDate)) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(date.clone());
      date = date.add(1, "day");
    }
    days.push(week);
  }

  return (
    <div className="calendar-container">
      <div className="header">
        <button onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}>←</button>
        <h2>{currentMonth.format("MMMM YYYY")}</h2>
        <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>→</button>
      </div>

      <form className="event-form" onSubmit={handleAddOrUpdate}>
        <input
          type="text"
          placeholder="Title"
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <input
          type="date"
          value={newEvent.date}
          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        />
        <input
          type="time"
          value={newEvent.time}
          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
        />
        <input
          type="text"
          placeholder="Duration"
          value={newEvent.duration}
          onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
        />
        <button type="submit">{editIndex !== null ? "Update" : "Add"} Event</button>
      </form>

      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-name">{day}</div>
        ))}

        {days.map((week, i) => (
          <React.Fragment key={i}>
            {week.map((day) => {
              const dateStr = day.format("YYYY-MM-DD");
              const isToday = day.isSame(dayjs(), "day");
              const isThisMonth = day.month() === currentMonth.month();
              const dayEvents = getEventsForDate(dateStr);

              return (
                <div key={dateStr} className={`day ${isThisMonth ? "" : "dimmed"} ${isToday ? "today" : ""}`}>
                  <div className="date-number">{day.date()}</div>
                  <div className="events">
                    {dayEvents.map((event, i) => (
                      <div key={i} className="event">
                        <strong>{event.time}</strong> - {event.title} ({event.duration})
                        <div className="event-buttons">
                          <button onClick={() => handleEdit(event.index)}>Edit</button>
                          <button onClick={() => handleDelete(event.index)}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
