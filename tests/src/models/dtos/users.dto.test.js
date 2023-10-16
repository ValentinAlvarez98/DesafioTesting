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

// Sección de pruebas
describe('User DTOs Tests', () => {

      // Se definen las variables globales a utilizar en las pruebas
      const admin = CONFIG.ADMIN;

      // Se definen los mocks globales
      const mockUser = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@gmail.com',
            age: 25,
            password: 'testpassword',
      };

      const mockRegisterUser = {
            ...mockUser,
            confirm_password: 'testpassword',
      };

      const mockPremiumUser = {
            ...mockRegisterUser,
            role: 'premium',
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

      const mockUserPassWrong = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@gmail.com',
            age: 25,
            password: 'wrongpassword',
            confirm_password: 'wrongpassword',
      };

      const mockUserEmailWrong = {
            ...mockRegisterUser,
            email: 'test@invalid.com',
      }

      const mockUpdatedUser = {
            ...mockRegisterUser,
            first_name: 'Usuario Test Actualizado',
            phone: '1234567890',
      };

      const mockUserDB = {
            _id: '6102d63f5f48d51d2c98dc8d',
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@gmail.com',
            age: 25,
            password: createHash('testpassword'),
            role: 'user',
            date_created: Date.now(),
      }

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
                  expect(dto.email).to.equal('test@gmail.com');

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para GetUserDTO, con un email inválido', () => {

                  // Given
                  const dto = new GetUserDTO({
                        email: 'test@invalid.com'
                  });

                  // Then
                  expect(dto.errors).to.not.be.empty;

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
                  expect(dto.email).to.equal(mockUser.email);

                  expect(dto.errors).to.be.undefined;

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
                  expect(dto.errors).to.not.be.empty;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO, debido a no tener un usuario de la base de datos', () => {

                  // Given
                  const dto = new LoadUserDTO({
                        ...mockUser
                  }, null);

                  // Then
                  expect(dto.errors).to.not.be.empty;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new LoadUserDTO({
                        ...mockUserDB
                  }, {
                        ...mockUserEmailWrong
                  });

                  // Then
                  expect(dto.errors).to.not.be.empty;

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
                  expect(dto.email).to.equal(mockUser.email);

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería productir un DTO válido para SaveUserDTO con el password hasheado, debido a un usuario válido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockRegisterUser
                  });

                  // Then
                  expect(dto.password).to.not.equal(mockUser.password);

            });

            // Descripción de la prueba
            it('Debería producir un DTO válido para SaveUserDTO, debido a un usuario válido con rol premium', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockPremiumUser
                  });

                  // Then
                  expect(dto.email).to.equal(mockUser.email);

                  expect(dto.role).to.equal('PREMIUM');

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO valido para SaveUserDTO con telefono, debido a un usuario válido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockUpdatedUser
                  });

                  // Then
                  expect(dto.email).to.equal(mockUpdatedUser.email);

                  expect(dto.phone).to.equal(mockUpdatedUser.phone);

                  expect(dto.errors).to.be.undefined;

            });


            // Descripción de la prueba
            it('Debería producir un DTO inválido para SaveUserDTO, debido a una contraseña inválida', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockRegisterUser,
                        password: '123456'
                  });

                  // Then
                  expect(dto.errors[0]).to.equal('La contraseña debe tener al menos 8 caracteres');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para SaveUserDTO, debido a que las contraseñas no coinciden', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockUser
                  });

                  // Then
                  expect(dto.errors[0]).to.equal('Las contraseñas no coinciden');

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para SaveUserDTO, debido a un email inválido', () => {

                  // Given
                  const dto = new SaveUserDTO({
                        ...mockUserEmailWrong
                  });

                  // Then
                  expect(dto.errors[0]).to.equal('Se requiere un email valido');

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
                  expect(dto.email).to.equal(mockUpdatedUser.email);

                  expect(dto.first_name).to.equal(mockUpdatedUser.first_name);

                  expect(dto.errors).to.be.undefined;

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
                  expect(dto.email).to.equal(mockPremiumUser.email);

                  expect(dto.role).to.equal('PREMIUM');

                  expect(dto.errors).to.be.undefined;

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
                  expect(dto._id).to.equal(mockUserDB._id);

                  expect(dto.password).to.equal(mockUserDB.password);

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para UpdateUserDTO, debido a un usuario ingresado válido y un usuario vacío de la base de datos', () => {

                  // Given
                  const dto = new UpdateUserDTO({
                        ...mockUser
                  }, null);

                  // Then
                  expect(dto.errors[0]).to.equal('El usuario que se intenta modificar, no existe');

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
                  expect(dto.errors[0]).to.equal('Contraseña incorrecta');

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
                  expect(dto.errors[0]).to.equal('Se requiere un email valido');

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
                  expect(dto.email).to.equal(mockUserDB.email);

                  expect(dto.errors).to.be.undefined;

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
                  expect(dto.errors[0]).to.equal('El usuario que se intenta eliminar, no existe');

                  expect(dto2.errors[0]).to.equal('El usuario que se intenta eliminar, no existe');

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
                  expect(dto.errors[0]).to.equal('Se requiere un email valido');

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
                  expect(dto.errors[0]).to.equal('Contraseña incorrecta');

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
                  expect(dto.email).to.equal(mockAdminUser.email);

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadAdminDTO, debido a un usuario ingresado válido y un usuario vacío de las variables de entorno', () => {

                  // Given
                  const dto = new LoadAdminDTO({
                        ...mockLoginAdminUser
                  }, null);

                  // Then
                  expect(dto.errors[0]).to.equal('El usuario que se intenta cargar, no existe');

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
                  expect(dto.errors[0]).to.equal('El usuario no existe');

                  expect(dto.errors[1]).to.equal('Contraseña incorrecta');

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
                  expect(dto.email).to.equal(mockUser.email);

                  expect(dto.password_reset_token).to.not.be.undefined;

                  expect(dto.password_reset_token).to.be.a('string');

                  expect(dto.password_reset_expires).to.be.a('date');

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para CreateResetTokenDTO, debido a un usuario vacío de la base de datos', () => {

                  // Given
                  const dto = new CreateResetTokenDTO(null);

                  // Then
                  expect(dto.errors[0]).to.equal('El usuario que se intenta cargar, no existe');

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
                  expect(dto.email).to.equal(mockUpdatedUser.email);

                  expect(dto.password).to.not.equal(mockUserDB.password);

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para ResetPasswordDTO, debido a un usuario ingresado válido y un usuario vacío de la base de datos', () => {

                  // Given
                  const dto = new ResetPasswordDTO({
                        ...mockUpdatedUser
                  }, null);

                  // Then
                  expect(dto.errors[0]).to.equal('El usuario que se intenta cargar, no existe');

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
                  expect(dto.errors[0]).to.equal('Se requiere un email valido');

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
                  expect(dto.errors[0]).to.equal('La contraseña debe tener al menos 8 caracteres');

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
                  expect(dto.errors[0]).to.equal('Las contraseñas no coinciden');

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
                  expect(dto.errors[0]).to.equal('La contraseña no puede ser igual a la anterior');

            });

      });


});