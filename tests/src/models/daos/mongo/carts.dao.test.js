import mongoose from 'mongoose';
import {
      getDAOS
} from '../../../../../src/models/daos/index.daos.js';
import Assert from 'assert';

const {
      cartsMongoDAO,
      usersMongoDAO,
      productsMongoDAO
} = getDAOS();

mongoose.connect(`mongodb://127.0.0.1:27017/testing?retryWrites=true&w=majority`)

// Descripción del grupo de pruebas
describe('Pruebas del DAO de carritos', () => {

      let mockCart = {
            code: '123456',
            products: []
      }

      let mockUser = {
            first_name: 'Usuario 1',
            last_name: 'Test',
            email: 'usuario1test@gmail.com',
            age: 25,
            password: '12345678',
      }

      let mockProduct = {
            title: 'Producto 1',
            description: 'Producto 1 de prueba',
            code: '123456',
            price: 100,
            stock: 10,
            category: 'Test',
            id: 1,
      }

      // Este hook se ejecuta antes de todos los tests
      before(function () {

            this.cartsDao = cartsMongoDAO;
            this.usersDao = usersMongoDAO;
            this.productsDao = productsMongoDAO;

      });

      // Este hook se ejecuta antes de cada test
      beforeEach(function () {

            // Establecemos un timeout de 5 segundos para cada test, debido a que estamos trabajando con una base de datos
            this.timeout(5000);

      });

      after(function () {

            mongoose.connection.collections.users.drop();
            mongoose.connection.collections.carts.drop();
            mongoose.connection.collections.products.drop();

      });

      // Se describe el test
      it('El DAO debe devolver los carritos en formato de arreglo', async function () {

            // Given
            console.log(`\n` + "---------------------------")
            console.log("Dada una instancia de CartsDao:")
            console.log("---------------------------")
            console.log(await this.cartsDao);
            console.log("---------------------------")

            // When
            console.log("Cuando ejecutamos el método get():")
            console.log("---------------------------")
            const carts = await this.cartsDao.getAll();
            console.log(carts);
            console.log("---------------------------")

            // Then
            console.log("Entonces el resultado debe ser un arreglo:")
            const result = Array.isArray(carts);
            console.log("---------------------------")
            console.log(result);
            console.log("---------------------------")
            Assert.strictEqual(result, true);

      })

      // Se describe el test
      it('El DAO debe agregar un carrito correctamente a la base de datos', async function () {

            // Given
            console.log(`\n` + "---------------------------")
            console.log("Dada una instancia de CartsDao:")
            console.log("---------------------------")
            console.log(await this.cartsDao);
            console.log("---------------------------")
            console.log("Y dado un usuario:")
            console.log("---------------------------")

            const user = await this.usersDao.addOne(mockUser);

            console.log(user);

            mockCart = {
                  ...mockCart,
                  user: user._id
            }


            mockUser = user;
            console.log("---------------------------")


            // When
            console.log("Cuando ejecutamos el método saveOne():")
            console.log("---------------------------")
            const cart = await this.cartsDao.saveOne(mockCart);
            console.log(cart);
            console.log("---------------------------")

            // Then
            console.log("Entonces el resultado debe ser un objeto:")
            const result = typeof cart === 'object';
            console.log("---------------------------")
            console.log(result);
            console.log("---------------------------")
            Assert.strictEqual(result, true);

      })

      // Se describe el test
      it('El DAO debe devolver un carrito en formato de objeto', async function () {

            // Given
            console.log(`\n` + "---------------------------")
            console.log("Dada una instancia de CartsDao:")
            console.log("---------------------------")
            console.log(await this.cartsDao);
            console.log("---------------------------")

            // When
            console.log("Cuando ejecutamos el método getOne():")
            console.log("---------------------------")
            const cart = await this.cartsDao.getOne(mockCart);
            console.log(cart);
            console.log("---------------------------")

            // Then
            console.log("Entonces el resultado debe ser un objeto:")
            const result = typeof cart === 'object';
            console.log("---------------------------")
            console.log(result);
            console.log("---------------------------")
            Assert.strictEqual(result, true);

      })

      // Se describe el test
      it('El DAO debe agregar un producto al carrito correctamente', async function () {

            // Given
            console.log(`\n` + "---------------------------")
            console.log("Dada una instancia de CartsDao:")
            console.log("---------------------------")
            console.log(await this.cartsDao);
            console.log("---------------------------")
            console.log("Dado un producto:")
            console.log("---------------------------")
            mockProduct = {
                  ...mockProduct,
                  owner: mockUser._id
            }
            const product = await this.productsDao.saveProduct(mockProduct);
            const productToAdd = {
                  product: product._id,
                  quantity: 1,
                  price: product.price
            }
            console.log(productToAdd);
            console.log("---------------------------")
            console.log("Y dado un carrito actualizado con el producto:")
            console.log("---------------------------")
            mockCart = {
                  ...mockCart,
                  products: [productToAdd]
            }

            // When
            console.log("Cuando ejecutamos el método addProduct():")
            console.log("---------------------------")
            const cart = await this.cartsDao.addProduct(mockCart.code, mockCart);
            console.log(cart);
            console.log("---------------------------")

            // Then
            console.log("Entonces el resultado debe incluir un objeto dentro del array 'products':")
            const result = cart.products.length > 0;
            console.log("---------------------------")
            console.log(result);
            console.log("---------------------------")
            Assert.strictEqual(result, true);

      })

})