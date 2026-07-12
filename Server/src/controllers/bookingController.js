import bookingService from '../services/bookingService.js';

class BookingController {
  async getAll(req, res, next) {
    try {
      const data = await bookingService.getAllBookings();
      res.status(200).json({
        success: true,
        message: 'Bookings retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getResources(req, res, next) {
    try {
      const data = await bookingService.getResources();
      res.status(200).json({
        success: true,
        message: 'Resources retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const data = await bookingService.createBooking(req.body);
      res.status(201).json({
        success: true,
        message: 'Booking created successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getSpaceUtilization(req, res, next) {
    try {
      const data = await bookingService.getSpaceUtilization();
      res.status(200).json({
        success: true,
        message: 'Space utilization stats retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new BookingController();
