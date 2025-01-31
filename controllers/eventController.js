const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Event = require('../models/eventModel');

const sendEmailNotification = async (participantEmail, eventName) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: participantEmail,
      subject: 'Event Notification',
      text: `You have successfully registered for the event: ${eventName}`
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email notification: ', error);
  }
};

const createEvent = async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { name, date, description } = req.body;
  const newEvent = new Event({ name, date, description, participants: [] });
  await newEvent.save();
  res.status(201).json({ message: 'Event created successfully', event: newEvent });
};

const getEvents = async (req, res) => {
  const events = await Event.find();
  res.status(200).json(events); // Return events array directly
};

const getEventById = async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.status(200).json(event);
};

const updateEvent = async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  const { name, description, date } = req.body;
  event.name = name;
  event.description = description;
  event.date = date;
  await event.save();
  res.status(200).json({ message: 'Event updated successfully', event });
};

const deleteEvent = async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const eventId = req.params.id;
  const event = await Event.findByIdAndDelete(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  res.status(200).json({ message: 'Event deleted successfully' });
};

const registerForEvent = async (req, res) => {
  const eventId = req.params.id;
  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }
  if (event.participants.some(participant => participant.email === req.body.participantEmail)) {
    return res.status(400).json({ message: 'User already registered for the event' });
  }
  const { participantName, participantEmail } = req.body;
  event.participants.push({ name: participantName, email: participantEmail });
  await event.save();
  await sendEmailNotification(participantEmail, event.name);
  res.status(200).json({ message: 'Participant registered successfully', event });
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent, registerForEvent };
