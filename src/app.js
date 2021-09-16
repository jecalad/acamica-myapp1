const express = require('express');
const basicAuth = require('express-basic-auth');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const userRoutes = require('./routes/User.routes');
const myCustomAuthorizer = require('./middleware/basic-auth.middleware');
const ProductsRoutes = require('./routes/products.routes');
const PaymentRoutes = require('./routes/payment.routes');
const orderRoutes = require('./routes/order.routes');
const closedRoutes = require('./routes/closedOrder.routes');
const registerRoutes = require('./routes/register.routes');
const loginRoutes = require('./routes/login.routes');
const orderStatus = require('./routes/orderstatus.routes');

const swaggerOptions = require('./utils/swaggerOptions');

//Inicualizar express
const app = express();

//Swagger Documentacion
const swaggerSpecs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));

//uso Cors
app.use(cors());

//HOME
app.use(express.static('src/public'));

//Body Parse
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Registro
app.use('/register', registerRoutes)

//autenticacion
app.use(basicAuth({ authorizer: myCustomAuthorizer }));

//login
app.use('/login', loginRoutes)

//Rutas users
app.use('/users', userRoutes)

//rutas Productos
app.use('/products', ProductsRoutes)

//Medios de Pago
app.use('/payment', PaymentRoutes)

//Pedidos
app.use('/orders', orderRoutes)

//Cerrar Pedido
app.use('/closeorder', closedRoutes)

//actualizar estado de la orden
app.use('/orderStatus', orderStatus)

//Server
app.listen(3000, ()=>{ console.log("server listening port 3000");})