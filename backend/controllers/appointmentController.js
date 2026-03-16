import { asyncHandler } from '../middleware/errorMiddleware.js';
import Appointment from '../models/Appointment.js';

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
export const bookAppointment = asyncHandler(async (req, res) => {
    const { name, phone, date, time, message } = req.body;

    const appointment = new Appointment({
        user: req.user._id,
        name,
        phone,
        date,
        time,
        message,
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
});

// @desc    Get user appointments
// @route   GET /api/appointments/myappointments
// @access  Private
export const getMyAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({ user: req.user._id });
    res.json(appointments);
});

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin
export const getAppointments = asyncHandler(async (req, res) => {
    const appointments = await Appointment.find({}).populate('user', 'id name email');
    res.json(appointments);
});

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        appointment.status = status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
});
