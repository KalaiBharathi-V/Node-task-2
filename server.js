const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

let rooms = [];
let bookings = [];

app.post('/rooms', (req, res) => {
  const { roomName, seatsAvailable, amenities, pricePerHour } = req.body;
  const room = {
    id: rooms.length + 1,
    roomName,
    seatsAvailable,
    amenities,
    pricePerHour
  };
  rooms.push(room);
  res.json(room);
});

app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const existingBooking = bookings.find(booking => booking.roomId === roomId && booking.date === date && 
    ((startTime >= booking.startTime && startTime < booking.endTime) || 
    (endTime > booking.startTime && endTime <= booking.endTime)));
  if (existingBooking) {
    return res.status(400).json({ error: 'Room already booked for this time' });
  }
  const booking = {
    id: bookings.length + 1,
    customerName,
    date,
    startTime,
    endTime,
    roomId
  };
  bookings.push(booking);
  res.json(booking);
});

app.get('/rooms/bookings', (req, res) => {
  const roomsWithBookings = rooms.map(room => {
    const roomBookings = bookings.filter(booking => booking.roomId === room.id);
    return {
      roomName: room.roomName,
      bookedStatus: roomBookings.length > 0 ? 'Booked' : 'Available',
      bookings: roomBookings
    };
  });
  res.json(roomsWithBookings);
});

app.get('/customers/bookings', (req, res) => {
  const customersWithBookings = bookings.map(booking => {
    const room = rooms.find(room => room.id === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room.roomName,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime
    };
  });
  res.json(customersWithBookings);
});

app.get('/customers/:customerName/bookings', (req, res) => {
  const customerName = req.params.customerName;
  const customerBookings = bookings.filter(booking => booking.customerName === customerName);
  res.json(customerBookings);
});
