const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


router.get('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({error: error})}
    conn.query(
      'SELECT * FROM products',
      (error, result, fields) => {
        if (error) { return res.status(500).send({error: error})}
        const response = {
          quantity: result.length, 
          products: result.map(prod => {
            return {
              product_id: prod.product_id,  
              name: prod.name, 
              price: prod.price, 
              request: {
                type: 'GET',
                description:'Retorna detalhes do produto',
                url: 'http://localhost:3000/products/'  + prod.product_id
              }
            }
          })
        }
        return res.status(200).send(response)
      }
    )
  })
});

router.post('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if(error){return res.status(500).send({ error : error})}
    conn.query(
      'INSERT INTO products (name, price) VALUES (?,?)',
      [req.body.name, req.body.price],
      (error, result, field) => {
        conn.release();
        if (error) {
          return res.status(500).send({error: error})}
        const response = {
          mensagem:'Produto inserido com sucesso',
          produtoCriado: {
            product_id: result.product_id,
            name: req.body.name, 
            price: req.body.price,
            request:{
              type: 'GET',
              description:'Retorna todos os produtos',
              url: 'http://localhost:3000/products/' 
            } 
          }
        }
        res.status(201).send(response);
      }
    )
  })
});

router.get('/:product_id', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({error: error})}
    conn.query(
      'SELECT * FROM products WHERE product_id = ?',
      [req.params.product_id],
      (error, result, field) => {
        if (error) { return res.status(500).send({error: error})}

        if(result.length == 0) { 
          return res.status(404).send({
            mensagem: 'Não foi encontrado produto com este ID'
          })
        }
        const response = {
          mensagem:'Produto inserido com sucesso',
          produto: {
            product_id: result[0].product_id,
            name: result[0].name, 
            price: result[0].price,
            request:{
              type: 'GET',
              description:'Retorna todos os produtos',
              url: 'http://localhost:3000/products/'
            } 
          }
        }
        return res.status(200).send(response);
      
      }
    )
  })  
});

router.patch('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({error: error})}
    conn.query(
      `UPDATE products 
          SET name        = ?,
              price       = ?
        WHERE product_id  = ?`,
      [
        req.body.name,
        req.body.price,
        req.body.product_id
      ],
      (error, result, field) => {
        if (error) { return res.status(500).send({error: error})}
        const response = {
          mensagem:'Produto inserido com sucesso',
          produtoAtualizado: {
            product_id: req.bodyproduct_id,
            name: req.body.name, 
            price: req.body.price,
            request:{
              type: 'GET',
              description:'Retorna dados do produto atualizado',
              url: 'http://localhost:3000/products/' + req.body.product_id
            } 
          }
        }
        res.status(202).send(response);
      }
    )
  })  
});

router.delete('/', (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) { return res.status(500).send({error: error})}
    conn.query(
      `DELETE FROM products WHERE product_id  = ?`,[req.body.product_id],
      (error, result, field) => {
        if (error) { return res.status(500).send({error: error})}
        const response = {
          mensagem: 'Produto removido com sucesso',
          request: {
            tip: 'POST',
            descricao: 'Insere um produto ',
            body: {
              name: 'String',
              price: 'Number'
            },
            url: 'http://localhost:3000/products/'
          }
        }
        return res.status(202).send(response)
      }
    )
  })
});

module.exports = router;