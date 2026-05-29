const app = require('./src/app');
const connectDB = require('./src/config/database');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor LUMINIS ejecutándose en puerto ${PORT}`);
  console.log(`🌍 Modo: ${process.env.NODE_ENV}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`📊 Base de datos: ${process.env.MONGODB_URI}`);
});