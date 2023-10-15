import {
      expect
} from 'chai';
import {
      getDTOS
} from '../../../src/models/dtos/index.dtos.js';
import {
      createHash
} from '../../../src/utils/bcrypt/bcrypt.utils.js';

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

      const mockUser = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@gmail.com',
            age: 25,
            password: 'testpassword',
      };

      const mockUserPassWrong = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@gmail.com',
            age: 25,
            password: 'wrongpassword',
      };

      const mockUserEmailWrong = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'test@invalid.com',
            age: 25,
            password: 'testpassword',
      }

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
      describe('GetUserDTO Tests', () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para GetUserDTO', () => {

                  const dto = new GetUserDTO({
                        email: 'test@gmail.com',
                        password: 'testpassword'
                  });

                  expect(dto.email).to.equal('test@gmail.com');

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para GetUserDTO', () => {

                  const dto = new GetUserDTO({
                        email: 'test@invalid.com'
                  });

                  expect(dto.errors).to.not.be.empty;

            });

      });

      // Se describe el grupo de pruebas de LoadUserDTO
      describe('LoadUserDTO Tests', () => {

            // Descripción de la prueba
            it('Debería producir un DTO válido para LoadUserDTO', () => {

                  const dto = new LoadUserDTO({
                        ...mockUser
                  }, {
                        ...mockUserDB
                  });

                  expect(dto.email).to.equal(mockUser.email);

                  expect(dto.errors).to.be.undefined;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO', () => {

                  const dto = new LoadUserDTO({
                        ...mockUserPassWrong
                  }, {
                        ...mockUserDB
                  });

                  expect(dto.errors).to.not.be.empty;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO', () => {

                  const dto = new LoadUserDTO({
                        ...mockUser
                  }, null);

                  expect(dto.errors).to.not.be.empty;

            });

            // Descripción de la prueba
            it('Debería producir un DTO inválido para LoadUserDTO', () => {

                  const dto = new LoadUserDTO({
                        ...mockUserDB
                  }, {
                        ...mockUserEmailWrong
                  });

                  expect(dto.errors).to.not.be.empty;

            });

      });



});