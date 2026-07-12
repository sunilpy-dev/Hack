import employeeService from '../services/employeeService.js';

class EmployeeController {
  async getAll(req, res, next) {
    try {
      const data = await employeeService.getAllEmployees();
      res.status(200).json({
        success: true,
        message: 'Employees retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }

  async getDepartments(req, res, next) {
    try {
      const data = await employeeService.getDepartments();
      res.status(200).json({
        success: true,
        message: 'Departments retrieved successfully',
        data
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new EmployeeController();
