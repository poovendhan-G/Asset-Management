const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');

require('./models/asset');
require('./models/employee');
require('./models/assetLog');
require('./models/category');

const assetRoutes = require('./routes/assetroutes');
const employeeRoutes = require('./routes/employeeroutes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/assets/test', (req, res) => {
    res.send('Assets route working');
});

app.use('/assets', assetRoutes);
app.use('/employees', employeeRoutes);

sequelize
    .sync()
    .then(() => console.log('Tables synced'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
