import mongoose from 'mongoose';
import {
      getDAOS
} from '../../../../src/models/daos/index.daos.js';
import Assert from 'assert';
import {
      expect
} from 'chai';
import {
      createHash,
      compareHash
} from '../../../../src/utils/bcrypt/bcrypt.utils.js';

const {
      usersMongoDAO,
      productsMongoDAO,
      cartsMongoDAO
} = getDAOS();

function connectToDatabase() {
      return mongoose.connect('mongodb://127.0.0.1:27017/testing?retryWrites=true&w=majority');
}

// Descripción del grupo de pruebas
describe('Pruebas del DAO de usuarios', () => {

      // Creación de un usuario de prueba
      let mockUser = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'usertest@example.com',
            age: 25,
            password: 'testpassword',
            role: 'USER'
      };

      // Creación de un usuario de prueba con la contraseña hasheada
      let mockHashedPassword = {
            ...mockUser,
            password: createHash(mockUser.password)
      };

      // Este hook se ejecuta antes de todos los tests
      before(async function () {

            await connectToDatabase();
            this.usersDao = usersMongoDAO;
            this.productsDao = productsMongoDAO;
            this.cartsDao = cartsMongoDAO;
            this.originalPassword = mockUser.password;

      });

      // Este hook se ejecuta antes de cada test
      beforeEach(function () {
            this.timeout(5000);
      });

      // Este hook se ejecuta después de cada test
      after(async function () {
            await mongoose.connection.collections.users.drop();
      });

      // Descripción de la prueba
      it('El DAO debe agregar un usuario a la base de datos con su contraseña hasheada correctamente', async function () {

            // When
            const userAdded = await this.usersDao.addOne(mockHashedPassword);

            const result = await this.usersDao.getOne({
                  email: mockUser.email
            });

            const isPasswordCorrect = compareHash(this.originalPassword, result);

            // Then
            expect(result).to.exist;

            expect(isPasswordCorrect).to.be.true;

            for (const key in mockUser) {

                  if (key !== 'password') {

                        expect(mockUser[key]).to.be.equal(result[key]);

                  }

            }

            mockHashedPassword = {
                  ...mockHashedPassword,
                  _id: userAdded._id
            };

      });

      // Descripción de la prueba
      it('El DAO debe devolver un usuario basado en su correo electrónico', async function () {

            // When
            const result = await this.usersDao.getOne({
                  email: mockUser.email
            });

            // Then
            expect(result).to.exist;

            for (const key in mockUser) {

                  if (key !== 'password') {

                        expect(mockUser[key]).to.be.equal(result[key]);

                  }

            }

      });

      it('El DAO debe devolver un usuario basado en su ID', async function () {

            // Given
            const userOnlyWithId = {
                  _id: mockHashedPassword._id
            };

            // When
            const result = await this.usersDao.getOne(userOnlyWithId);

            // Then
            expect(result).to.exist;

            for (const key in mockUser) {

                  if (key !== 'password') {

                        expect(mockUser[key]).to.be.equal(result[key]);
                        console.log(mockUser[key], result[key]);

                  }

            }

            await this.usersDao.deleteOne({
                  email: mockUser.email
            });

      });

});