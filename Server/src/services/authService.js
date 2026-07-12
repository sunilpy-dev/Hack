import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import authRepository from '../repositories/authRepository.js';
import logRepository from '../repositories/logRepository.js';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../utils/errors.js';

class AuthService {
  async login(email, password) {
    if (!email || !password) {
      throw new ValidationError('Email and password are required.');
    }

    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError('Invalid email');
    }

    // Get associated employee info
    const employee = await authRepository.getEmployeeByUserId(user.id);

    // 1. Check account suspension/inactivity
    if (employee && employee.status === 'suspended') {
      throw new ForbiddenError('Account suspended');
    }

    if (!user.is_active || (employee && (employee.status === 'terminated' || employee.status === 'resigned'))) {
      throw new ForbiddenError('Account inactive');
    }

    // 2. Check account lock status
    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      throw new ForbiddenError('Account locked');
    }

    // 3. Check temporary password expiration (24 hours)
    if (user.password_reset_required && user.password_changed_at) {
      const ageMs = Date.now() - new Date(user.password_changed_at).getTime();
      if (ageMs > 24 * 60 * 60 * 1000) {
        throw new ForbiddenError('Temporary password expired');
      }
    }

    // 4. Check regular password expiration (90 days)
    if (!user.password_reset_required && user.password_changed_at) {
      const ageMs = Date.now() - new Date(user.password_changed_at).getTime();
      if (ageMs > 90 * 24 * 60 * 60 * 1000) {
        throw new ForbiddenError('Password expired');
      }
    }

    // Verify Password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      // Increment failed attempts
      let lockUntil = null;
      const failedAttempts = user.failed_login_attempts + 1;
      
      if (failedAttempts >= 5) {
        lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes
      }

      await authRepository.incrementFailedAttempts(user.id, lockUntil);

      if (lockUntil) {
        throw new ForbiddenError('Account locked');
      } else {
        throw new UnauthorizedError('Invalid password');
      }
    }

    // Success: Reset failed attempts
    if (user.failed_login_attempts > 0 || user.locked_until) {
      await authRepository.resetFailedAttempts(user.id);
    }

    // Check if password change is forced on first login
    if (user.password_reset_required) {
      const tempToken = jwt.sign(
        { userId: user.id, email: user.email, tempReset: true, role: 'Employee', permissions: [] },
        process.env.JWT_SECRET || 'assetflow-jwt-secure-secret-key-99',
        { expiresIn: '15m' }
      );
      return {
        passwordResetRequired: true,
        userId: user.id,
        email: user.email,
        token: tempToken
      };
    }

    // Generate JWT Token
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role_name,
      permissions: user.permissions,
      employeeId: employee ? employee.id : null
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'assetflow-jwt-secure-secret-key-99',
      { expiresIn: '12h' }
    );

    // Log login activity
    await logRepository.log({
      action_type: 'SELECT',
      entity_name: 'auth.users',
      record_id: user.id,
      old_values: { email: user.email, action: 'user_login' }
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role_name,
        permissions: user.permissions,
        employee: employee ? {
          id: employee.id,
          firstName: employee.first_name,
          lastName: employee.last_name,
          designation: employee.designation
        } : null
      }
    };
  }

  async changePassword(userId, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      throw new ValidationError('Old and new passwords are required.');
    }

    // Validate password complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      throw new ValidationError('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character.');
    }

    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ValidationError('User not found.');
    }

    // Retrieve full user record with password hash
    const fullUser = await authRepository.findByEmail(user.email);
    const isMatch = await bcrypt.compare(oldPassword, fullUser.password_hash);
    if (!isMatch) {
      throw new ValidationError('Incorrect current password.');
    }

    // Check password history (prevent reuse of last 3 passwords)
    const history = await authRepository.getPasswordHistory(userId, 3);
    for (const pastHash of history) {
      const isReused = await bcrypt.compare(newPassword, pastHash);
      if (isReused) {
        throw new ValidationError('New password cannot be the same as any of the last 3 passwords used.');
      }
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Save previous password to history
    await authRepository.addPasswordHistory(userId, fullUser.password_hash);

    // Update password
    await authRepository.updatePassword(userId, passwordHash, false);

    // Log activity
    await logRepository.log({
      action_type: 'UPDATE',
      entity_name: 'auth.users',
      record_id: userId,
      old_values: { action: 'password_change' }
    });

    return { success: true };
  }

  async createEmployee(adminUserId, employeeData) {
    const { firstName, lastName, email, phone, departmentId, designation, roleName } = employeeData;

    // A. Input Sanitization/Checks
    if (!firstName || !lastName || !email || !departmentId || !designation || !roleName) {
      throw new ValidationError('All fields except phone are required to provision an employee.');
    }

    // B. Pre-insertion Validations (Run BEFORE opening the transaction connection)
    const dept = await authRepository.findDepartmentById(departmentId);
    if (!dept) {
      throw new ValidationError('The specified department does not exist in the system.');
    }

    const role = await authRepository.findRoleByName(roleName);
    if (!role) {
      throw new ValidationError(`The specified role "${roleName}" does not exist in the system.`);
    }

    const sysNotificationType = await authRepository.findNotificationTypeByName('EMPLOYEE_CREATED');
    if (!sysNotificationType) {
      throw new ValidationError('Unable to complete employee provisioning because notification configuration is incomplete. Please contact your administrator.');
    }

    const existingUser = await authRepository.findByEmail(email);
    const existingEmp = await authRepository.findEmployeeByEmail(email);
    if (existingUser || existingEmp) {
      throw new ValidationError('The corporate email address is already registered to another user.');
    }

    if (phone) {
      const existingPhone = await authRepository.findEmployeeByPhone(phone);
      if (existingPhone) {
        throw new ValidationError('The phone number is already registered to another employee.');
      }
    }

    // C. Atomic Transaction Implementation
    const client = await db.getPool().connect();
    try {
      await client.query('BEGIN');

      // Generate secure temporary password
      const tempPassword = `TempPass_${Math.floor(1000 + Math.random() * 9000)}!`;
      const passwordHash = await bcrypt.hash(tempPassword, 12);

      // 1. Create User
      const user = await authRepository.createUser(email, passwordHash, true, client);

      // 2. Assign Role
      await authRepository.assignRole(user.id, role.id, client);

      // 3. Generate unique sequential business employee number
      const countRes = await client.query('SELECT COUNT(*) FROM org.employees');
      const nextNum = String(Number(countRes.rows[0].count) + 1).padStart(6, '0');
      const empNo = `EMP-${nextNum}`;

      // 4. Create Employee Profile
      const employee = await authRepository.createEmployeeProfile(
        user.id,
        departmentId,
        empNo,
        firstName,
        lastName,
        email,
        designation,
        client
      );

      // 5. Create Notification
      const notification = await authRepository.createNotification(
        sysNotificationType.id,
        'Welcome to AssetFlow!',
        `Dear ${firstName}, your employee account has been created. Please complete your profile and update your password on your first login.`,
        'high',
        'https://assetflow.com/profile',
        client
      );

      await authRepository.createRecipient(notification.id, employee.id, client);

      // 6. Log admin action
      await logRepository.log({
        user_id: adminUserId,
        action_type: 'INSERT',
        entity_name: 'org.employees',
        entity_id: employee.id,
        new_values: { 
          email, 
          employee_number: empNo, 
          role: roleName, 
          department: dept.name, 
          action: 'employee_creation' 
        }
      }, client);

      await client.query('COMMIT');

      return {
        email,
        tempPassword,
        employeeNumber: empNo,
        roleName,
        departmentName: dept.name,
        passwordResetRequired: true
      };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }

  async getCurrentUser(userId) {
    const user = await authRepository.findById(userId);
    if (!user) return null;
    const employee = await authRepository.getEmployeeByUserId(userId);
    return {
      id: user.id,
      email: user.email,
      role: user.role_name,
      permissions: user.permissions,
      employee: employee ? {
        id: employee.id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        designation: employee.designation
      } : null
    };
  }
}

export default new AuthService();
