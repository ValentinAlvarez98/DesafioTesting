import mongoose from 'mongoose';
import {
      getDAOS
} from '../../../../src/models/daos/index.daos.js';
import Assert from 'assert';
import {
      expect
} from 'chai';
import {
      createHash
} from '../../../../src/utils/bcrypt/bcrypt.utils.js';

const {
      productsMongoDAO,
      usersMongoDAO,
      cartsMongoDAO
} = getDAOS();

mongoose.connect('mongodb://127.0.0.1:27017/testing?retryWrites=true&w=majority');

// Descripción del grupo de pruebas
describe('Pruebas del DAO de productos', () => {

      // Se crea un producto de prueba
      let mockProduct = {
            title: 'Producto Test',
            description: 'Producto de prueba',
            code: 'test123',
            price: 100,
            stock: 10,
            category: 'Test',
            id: 1,
      };

      let mockUser = {
            first_name: 'Usuario Test',
            last_name: 'Test',
            email: 'usuario test',
            age: 25,
            password: createHash('testpassword'),
            role: 'PREMIUM'
      };

      // Este hook se ejecuta antes de todos los tests
      before(function () {
            this.productsDao = productsMongoDAO;
            this.usersDao = usersMongoDAO;
            this.cartsDao = cartsMongoDAO;
      });

      // Este hook se ejecuta antes de cada test
      beforeEach(async function () {
            this.timeout(5000);
            const user = await this.usersDao.addOne(mockUser);
            mockProduct.owner = user._id;
      });

      // Este hook se ejecuta después de cada test
      after(function () {
            mongoose.connection.collections.products.drop();
      });

      afterEach(async function () {
            await mongoose.connection.collections.users.drop();
      })

      // Descripción de la prueba
      it('El DAO debe poder crear un producto y guardarlo en la base de datos', async function () {

            // When
            const product = await this.productsDao.saveProduct(mockProduct);

            // Then
            expect(product).to.have.property('_id');


      });

      it('El DAO debe poder devolver un producto por su ID', async function () {

            // Given
            const product = await this.productsDao.saveProduct(mockProduct);

            // When
            const result = await this.productsDao.getById(product.id);

            // Then
            expect(result).to.exist;

            expect(result).to.have.property('id');

            expect(result.id.toString()).to.equal(product.id.toString());

      });


});