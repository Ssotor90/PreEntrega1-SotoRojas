const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./src/routes/authRoutes');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch((error) => console.log('Error conectando a MongoDB:', error));

const app = express();

app.use(express.json());
app.use(cookieParser());

require('./src/config/passport')(passport);

app.use('/api/sessions', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
