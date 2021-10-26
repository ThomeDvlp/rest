const express = require('express');
const app = express();
const morgan = require('morgan');


const productsRoute = require('./routes/products');
const requestsRoute = require('./routes/requests');
const usersRoute = require('./routes/users');

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Header', 
    'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'   
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).send({});
  }

  next();
})

app.use('/products', productsRoute);
app.use('/requests', requestsRoute);
app.use('/users', usersRoute);

app.use((req, res, next)=>{
  const erro = new Error('Não encontrado');
  erro.status = 404;
  next(erro);
});

app.use((error, req, res, next)=>{
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message
    }
  });
});

module.exports = app;
