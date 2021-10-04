const express = require('express');
const router = express.Router();


//Retorna todos os pedidos
router.get('/', (req, res, next) => {
  res.status(200).send({
    mensagem: 'Retorna os pedidos'
  });
});
//Insere um pedido
router.post('/', (req, res, next) => {
  const request = {
    request_id: req.body.request_id,
    quantity: req.body.quantity
  }
  res.status(201).send({
    mensagem: 'Pedido criado'
  });
});
// retorna os dados de um pedido
router.get('/:request_id', (req, res, next) => {
  const id = req.params.request_id
    res.status(200).send({
    mensagem: 'Parabéns você descobriu a rota surpresa!!!',
    id: id
  }); 
});

//Exclui um pedido
router.delete('/', (req, res, next) => {
  res.status(201).send({
    mensagem: 'Pedido excluído'
  });
});

module.exports = router;