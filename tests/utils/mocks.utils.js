import CONFIG from "../../src/config/environment/config.js";
import {
      createHash
} from "../../src/utils/bcrypt/bcrypt.utils.js";

// Se define la función para generar un usuario de prueba
export function generateMockUser(options = {}) {

      // Se define un usuario por defecto
      const defaultUser = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@gmail.com',
            age: 25,
            password: 'testpassword',
      };

      // Se sobreescriben las opciones por defecto con las opciones pasadas como parámetro
      return {
            ...defaultUser,
            ...options,
      };
}

const admin = CONFIG.ADMIN;

export const mockUsers = {
      mockUser: generateMockUser(),
      mockRegisterUser: generateMockUser({
            confirm_password: 'testpassword'
      }),
      mockPremiumUser: generateMockUser({
            confirm_password: 'testpassword',
            role: 'premium'
      }),
      mockUserPassWrong: generateMockUser({
            password: 'wrongpassword',
            confirm_password: 'wrongpassword',
      }),
      mockUserEmailWrong: generateMockUser({
            confirm_password: 'testpassword',
            email: 'test@invalid.com',
      }),
      mockUserDB: generateMockUser({
            _id: '6102d63f5f48d51d2c98dc8d',
            password: createHash('testpassword'),
            role: 'USER',
            date_created: Date.now(),
      }),
      mockUpdatedUser: generateMockUser({
            confirm_password: 'testpassword',
            first_name: 'Usuario Test Actualizado',
            phone: '1234567890',
      }),
      mockAdminUser: {
            first_name: admin.first_name,
            last_name: admin.last_name,
            email: admin.email,
            password: admin.password,
            role: admin.role,
      },
      mockLoginAdminUser: {
            email: admin.email,
            password: process.env.UNHASHED_PASSWORD,
      },
      mockWrongAdminUser: {
            email: 'admin@invalid.com',
            password: 'invalidpassword',
      },
}