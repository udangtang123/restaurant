import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import api from '../../../services/api';

import './styles.css';

function NewBooking() {
  const [id, setID] = useState(localStorage.getItem("id"));
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  
  const [date, setDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotID, setSlotID] = useState(0);
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(0);

  const history = useHistory();

  useEffect(() => {
    async function loadProfile(){
    try {
      
      if(!id || !accessToken) return history.push('/login');
      
      const response = await api.get(`/users/${id}`);

      setFirstName(response.data.user.first_name);
      setLastName(response.data.user.last_name);
      setEmail(response.data.user.email);

    } catch (error) {
      alert(`Couldn't Load User Profile. Please try again. Error: ${error}.`);
    }
  }
  loadProfile();
  }, [])

  async function handleCheckAvailability(event){
    event.preventDefault();

    const response = await api.get(`availability?date=${date}&numberOfPeople=${parseInt(numberOfPeople)}`);
    if(response.data.availableSlots.length == 0){
      alert('No Slots available on this date');
    }
    
    setAvailableSlots(response.data.availableSlots);
  }

  async function handleBookingCreation(event){
    event.preventDefault();

    const data = {
      userID: id,
      date,
      slotID,
      numberOfPeople: parseInt(numberOfPeople),
      startTime,
      duration
    }

    try {
      const response = await api.post('bookings', data);

      alert('Booking Registered Succesfully');

      window.location.reload();

    } catch (error) {
      alert(`Couldn't Create Booking.`);
    }
  }

  return (
    <div className="new-booking-container">

        <form action="submit">

          <input 
            type="date" 
            value={date}
            onChange={event => setDate(event.target.value)}
          />
          <input 
            type="number" 
            placeholder="Number of people"
            value={numberOfPeople}
            onChange={event => setNumberOfPeople(event.target.value)}
          />

          <button className="secondary-button" onClick={handleCheckAvailability}>Check Availability</button>

          <ul>
            {availableSlots.map(slot => (
              <button key={slot.slot_id} value={slotID} onClick={ 
                function(event){ 
                  event.preventDefault();
                  setSlotID(slot.slot_id);
                  setStartTime(slot.start_time); 
                  setDuration(slot.duration);  
                } 
              }>
                <strong>{slot.start_time} - {slot.duration} mins {slot.available_capacity} capacity left</strong>
              </button>
            ))}
          </ul>

          <input 
            type="email" 
            placeholder="Your email you@email.com"
            value={email}
            onChange={event => setEmail(event.target.value)}
            disabled={slotID == 0}
          />

          <button className="button" disabled={slotID == 0} onClick={handleBookingCreation}>Send Booking</button>

        </form>
    </div>
  )
}

export default NewBooking;