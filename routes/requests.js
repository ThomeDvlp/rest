const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn, next) => {
    if(error) {return res.status(500).send({ error: error})}
    conn.query(
      'SELECT * FROM requests',
      (error, result, fields) =>{
        if(error) {return res.status(500).send({ error: error})}
        const response = {
          quantity: result.lenth,
          requests: result.map(req => {
            return {
              request_id: req.request_id,
              request_id: req.request_id,
              quantity: req.quantity,
              request: {
                tipo: 'Get',
                descricao: 'Retorna detalhes do pedido',
                url: 'http://localhost:3000/requests/' + req.request_id
              }
            }
          })
        }
        return res.status(200).send(response);
      }
    )
  });
  
});

router.post('/', (req, res, next) => {
  
  mysql.getConnection((error, conn) => {
    if(error){return res.status(500).send({ error : error})}
    
    conn.query('SELECT * FROM products WHERE product_id  = ?',
    [req.body.product_id],
    (error, result, field) => {
      if(error){return res.status(500).send({ error : error})}
      if(result.lenth == 0) {
        return res.status(404).send({
          mensagem: 'Produto não encontrado'
        })
      }
    }
    )
    conn.query(
      'INSERT INTO requests (products_product_id, quantity) VALUES (?,?)',
      [req.body.product_id, req.body.quantity],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({error: error})}
        const response = {
          mensagem:'Pedido inserido com sucesso',
          pedidoCriado: {
            request_id: result.request_id,
            request_id: req.body.request_id, 
            quantity: req.body.quantity,
            request:{
              type: 'GET',
              description:'Retorna todos os pedidos',
              url: 'http://localhost:3000/requests/' 
            } 
          }
        }
        res.status(201).send(response);
      }
    )
  })
});

router.get('/:request_id', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({error: error})}
    conn.query(
      'SELECT * FROM requests WHERE request_id = ?',
      [req.params.request_id],
      (error, result, field) => {
        if (error) { return res.status(500).send({error: error})}

        if(result.length == 0) { 
          return res.status(404).send({
            mensagem: 'Não foi encontrado pedido com este ID'
          })
        }
        const response = {
          mensagem:'Produto inserido com sucesso',
          pedido: {
            request_id: result[0].request_id,
            product_id: result[0].product_id, 
            quantity: result[0].quantity,
            request:{
              type: 'GET',
              description:'Retorna todos os pedidos',
              url: 'http://localhost:3000/requests/'
            } 
          }
        }
        return res.status(200).send(response);
      
      }
    )
  })
});

router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({error: error})}
    conn.query(
      `DELETE FROM requests WHERE request_id  = ?`,[req.body.request_id],
      (error, result, field) => {
        if (error) { return res.status(500).send({error: error})}
        const response = {
          mensagem: 'Pedido removido com sucesso',
          request: {
            tip: 'POST',
            descricao: 'Insere um pedido ',
            body: {
              product_id: 'Number',
              quantity: 'Number'
            },
            url: 'http://localhost:3000/requests/'
          }
        }
        return res.status(202).send(response)
      }
    )
  })
});

module.exports = router;