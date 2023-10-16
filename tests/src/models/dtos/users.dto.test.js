import {
      expect
} from 'chai';
import {
      getDTOS
} from '../../../../src/models/dtos/index.dtos.js';
import {
      createHash
} from '../../../../src/utils/bcrypt/bcrypt.utils.js';
import CONFIG from '../../../../src/config/environment/config.js';

const {
      GetUserDTO,
      LoadUserDTO,
      SaveUserDTO,
      UpdateUserDTO,
      DeleteUserDTO,
      LoadAdminDTO,
      CreateResetTokenDTO,
      ResetPasswordDTO,
} = getDTOS();

// Se define la clase AssertUtils
class AssertUtils {

      // Se define la función para validar un DTO
      static validDTO(dto) {

            expect(dto.errors).to.be.undefined;

      }

      // Se define la función para validar que los valores de ciertas propiedades de un DTO, sean iguales
      static validEqualsDTO(dto, properties, values) {

            properties.forEach((property, index) => {

                  expect(dto[property]).to.equal(values[index]);

            });

      }

      // Se define la función para validar que los valores de ciertas propiedades de un DTO, no sean iguales
      static validNotEqualsDTO(dto, properties, values) {

            properties.forEach((property, index) => {

                  expect(dto[property]).to.not.equal(values[index]);

            });

      }

      // Se define la función para validar que los valores de ciertas propiedades de un DTO, sean de cierto tipo
      static validTypeDTO(dto, properties, types) {

            properties.forEach((property, index) => {

                  expect(dto[property]).to.be.a(types[index]);

            });

      }

      // Se define la función para invalidar un DTO y validar que el mensaje de error sea el esperado
      static invalidDTO(dto, message) {

            expect(dto.errors).to.not.be.undefined;

            expect(dto.errors[0]).to.equal(message);

      }

}

// Sección de pruebas
describe('User DTOs Tests', () => {

      // Se definen las variables globales a utilizar en las pruebas
      const admin = CONFIG.ADMIN;

      // Se define la función para generar un usuario de prueba
      function generateMockUser(options = {}) {

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

      // Se definen los mocks globales
      const mockUser = generateMockUser();

      const mockRegisterUser = generateMockUser({
            confirm_password: 'testpassword'
      });

      const mockPremiumUser = generateMockUser({
            confirm_password: 'testpassword',
            role: 'premium'
      });

      const mockUserPassWrong = generateMockUser({
            password: 'wrongpassword',
            confirm_password: 'wrongpassword',
      });

      const mockUserEmailWrong = generateMockUser({
            confirm_password: 'testpassword',
            email: 'test@invalid.com',
      })

      const mockUserDB = generateMockUser({
            _id: '6102d63f5f48d51d2c98dc8d',
            password: createHash('testpassword'),
            role: 'USER',
            date_created: Date.now(),
      });

      const mockUpdatedUser = {
            ...mockRegisterUser,
            first_name: 'Usuario Test Actualizado',
            phone: '1234567890',
      };

      const mockAdminUser = {
            first_name: admin.first_name,
            last_name: admin.last_name,
            email: admin.email,
            password: admin.password,
            role: admin.role,
      };

      const mockLoginAdminUser = {
            email: admin.email,
            password: process.env.UNHASHED_PASSWORD,
      };

      const mockWrongAdminUser = {
            email: 'admin@invalid.com',
            password: 'invalidpassword',
      };


      // Se describe el grupo de pruebas de GetUserDTO
      describe(`\n GetUserDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para GetUserDTO, con un email válido', () => {

                  // Given
                  const dto = new GetUserDTO({
                        email: 'test@gmail.com',
                        password: 'testpassword'
                  });

                  // Then
                  AssertUtils.validEqualsDTO(dto, ['email', 'password'], ['test@gmail.com', 'testpassword']);

                  AssertUtils.validDTO(dto);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para GetUserDTO, con un email inválido', () => {

                  // Given
                  const dto = new GetUserDTO({
                        email: 'test@invalid.com'
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Se requiere un email valido');

            });

      });

      // Se describe el grupo de pruebas de LoadUserDTO
      describe(`\n LoadUserDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para LoadUserDTO, debido a un usuario ingresado válido y un usuario válido de la base de datos', () => {

                  // Given
                  const dto = new LoadUserDTO({
                        ...mockUser
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email', '_id'], [mockUser.email, mockUserDB._id]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO, debido a una contraseña incorrecta', () => {

                  // Given
                  const dto = new LoadUserDTO({
                        ...mockUserPassWrong
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Contraseña incorrecta')

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO, debido a no tener un usuario de la base de datos', () => {

                  // Given
                  const dto = new LoadUserDTO({
                        ...mockUser
                  }, null);

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta cargar, no existe');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new LoadUserDTO({
                        ...mockUserEmailWrong
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Se requiere un email valido');

            });

      });

      // Se describe el grupo de pruebas de SaveUserDTO
      describe(`\n SaveUserDTO Tests \n `, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para SaveUserDTO, debido a un usuario válido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockRegisterUser
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email'], [mockRegisterUser.email]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO válido para SaveUserDTO con el password hasheado, debido a un usuario válido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockRegisterUser
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validNotEqualsDTO(dto, ['password'], [mockRegisterUser.password]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO válido para SaveUserDTO, debido a un usuario válido con rol premium', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockPremiumUser
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email', 'role'], [mockPremiumUser.email, 'PREMIUM']);

            });

            // Descripción de la prueba
            it('Debería producir un DTO valido para SaveUserDTO con telefono, debido a un usuario válido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockUpdatedUser
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email', 'phone'], [mockUpdatedUser.email, mockUpdatedUser.phone]);

            });


            // Descripción de la prueba
            it('Debería producir un DTO inválido para SaveUserDTO, debido a una contraseña inválida', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockRegisterUser,
                        password: '123456'
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'La contraseña debe tener al menos 8 caracteres');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para SaveUserDTO, debido a que las contraseñas no coinciden', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockUser
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Las contraseñas no coinciden');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para SaveUserDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockUserEmailWrong
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Se requiere un email valido');

            });


      });

      // Se describe el grupo de pruebas de UpdateUserDTO
      describe(`\n UpdateUserDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para UpdateUserDTO, debido a un usuario ingresado válido y un usuario válido de la base de datos', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockUpdatedUser
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email', 'first_name'], [mockUpdatedUser.email, mockUpdatedUser.first_name]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO válido para UpdateUserDTO con rol Premium, debido a un usuario ingresado válido y un usuario válido de la base de datos', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockPremiumUser
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email', 'role'], [mockPremiumUser.email, 'PREMIUM']);

            });

            // Descripción de la prueba
            it('debería producir un DTO válido para UpdateUserDTO con igual _id e igual contraseña, debido a un usuario ingresado válido y un usuario válido de la base de datos', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockUpdatedUser
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['_id', 'password'], [mockUserDB._id, mockUserDB.password]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para UpdateUserDTO, debido a un usuario ingresado válido y un usuario vacío de la base de datos', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockUser
                  }, null);

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta actualizar, no existe');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para UpdateUserDTO, debido a una contraseña incorrecta', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockUserPassWrong
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Contraseña incorrecta');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para UpdateUserDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockUserEmailWrong
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Se requiere un email valido');

            });

      });

      // Se describe el grupo de pruebas de DeleteUserDTO
      describe(`\n DeleteUserDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para DeleteUserDTO, debido a un usuario válido', () => {

                  // Given
                  const dto = new DeleteUserDTO({
                        ...mockRegisterUser
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email'], [mockRegisterUser.email]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para DeleteUserDTO, debido a un usuario vacio', () => {

                  // Given
                  const dto = new DeleteUserDTO(null, {
                        ...mockUserDB
                  });

                  const dto2 = new DeleteUserDTO({
                        ...mockRegisterUser
                  }, null);

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta eliminar, no existe');

                  AssertUtils.invalidDTO(dto2, 'El usuario que se intenta eliminar, no existe');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para DeleteUserDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new DeleteUserDTO({
                        ...mockUserEmailWrong
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Se requiere un email valido');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para DeleteUserDTO, debido a una contraseña incorrecta', () => {

                  // Given
                  const dto = new DeleteUserDTO({
                        ...mockUserPassWrong
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Contraseña incorrecta');

            });

      });


      // Se describe el grupo de pruebas de LoadAdminDTO
      describe(`\n LoadAdminDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para LoadAdminDTO, debido a un usuario ingresado válido y un usuario válido de las variables de entorno', () => {

                  // Given
                  const dto = new LoadAdminDTO({
                        ...mockLoginAdminUser
                  }, {
                        ...mockAdminUser
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email'], [mockLoginAdminUser.email]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadAdminDTO, debido a un usuario ingresado válido y un usuario vacío de las variables de entorno', () => {

                  // Given
                  const dto = new LoadAdminDTO({
                        ...mockLoginAdminUser
                  }, null);

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta cargar, no existe');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadAdminDTO, debido a un usuario ingresado inválido y un usuario válido de las variables de entorno', () => {

                  // Given
                  const dto = new LoadAdminDTO({
                        ...mockWrongAdminUser
                  }, {
                        ...mockAdminUser
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta cargar, no existe');

            });

      });

      // Se describe el grupo de pruebas de CreateResetTokenDTO
      describe(`\n CreateResetTokenDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para CreateResetTokenDTO con el token y la fecha de expiración, debido a un usuario válido de la base de datos', () => {

                  // Given
                  const dto = new CreateResetTokenDTO({
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email'], [mockUserDB.email]);

                  AssertUtils.validTypeDTO(dto, ['password_reset_token', 'password_reset_expires'], ['string', 'date']);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para CreateResetTokenDTO, debido a un usuario vacío de la base de datos', () => {

                  // Given
                  const dto = new CreateResetTokenDTO(null);

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta cargar, no existe');

            });


      });

      // Se describe el grupo de pruebas de ResetPasswordDTO
      describe(`\n ResetPasswordDTO Tests \n`, () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para ResetPasswordDTO, debido a un usuario ingresado válido y un usuario válido de la base de datos', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUpdatedUser,
                        password: 'testpassword2',
                        confirm_password: 'testpassword2'
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.validDTO(dto);

                  AssertUtils.validEqualsDTO(dto, ['email'], [mockUpdatedUser.email]);

                  AssertUtils.validNotEqualsDTO(dto, ['password'], [mockUserDB.password]);

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para ResetPasswordDTO, debido a un usuario ingresado válido y un usuario vacío de la base de datos', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUpdatedUser
                  }, null);

                  // Then
                  AssertUtils.invalidDTO(dto, 'El usuario que se intenta cargar, no existe');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para ResetPasswordDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUserEmailWrong,
                        password: 'testpassword2',
                        confirm_password: 'testpassword2'
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Se requiere un email valido');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para ResetPasswordDTO, debido a una contraseña inválida', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUserPassWrong,
                        password: '123456',
                        confirm_password: '123456'
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'La contraseña debe tener al menos 8 caracteres');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para ResetPasswordDTO, debido a una confirmación de contraseña inválida', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUserPassWrong,
                        password: 'testpassword'
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'Las contraseñas no coinciden');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para ResetPasswordDTO, debido a una contraseña ingresada igual a la anterior', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUpdatedUser,
                        password: 'testpassword',
                        confirm_password: 'testpassword'
                  }, {
                        ...mockUserDB
                  });

                  // Then
                  AssertUtils.invalidDTO(dto, 'La contraseña debe ser diferente a la anterior');

            });

      });


});