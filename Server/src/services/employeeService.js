import employeeRepository from '../repositories/employeeRepository.js';

class EmployeeService {
  async getAllEmployees() {
    const list = await employeeRepository.findAll();
    return list.map(e => ({
      id: e.id,
      name: `${e.first_name} ${e.last_name}`,
      designation: e.designation,
      email: e.email
    }));
  }
}

export default new EmployeeService();
