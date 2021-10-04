const express = require('express');
const router = express.Router();


//Retorna todos os produtos
router.get('/', (req, res, next) => {
  res.status(200).send({
    mensagem: 'Retorna todos os produtos'
  });
});
//Insere um produto
router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price,
  }
  res.status(201).send({
    mensagem: 'Insere um produto',
    Produto: product
  });
});
// retorna os dados de um produto
router.get('/:product_id', (req, res, next) => {
  const id = req.params.product_id

  if(id ==='surprise') {
    res.status(200).send({
    mensagem: 'Parabéns você descobriu a rota surpresa!!!',
    id: id
  });
  } else {
    res.status(200).send({
      mensagem: 'Você digitou um ID',
      id: id
    });
  }  
});
//Altera um produto
router.patch('/', (req, res, next) => {
  res.status(201).send({
    mensagem: 'Produto alterado'
  });
});
//Explui um produto
router.delete('/', (req, res, next) => {
  res.status(201).send({
    mensagem: 'Proiduto excluído'
  });
});

module.exports = router;