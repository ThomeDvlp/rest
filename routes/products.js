const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const multer = require('multer');
const login = require('../middleware/login');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null,new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const upload = multer({ 
  storage: storage,
  limits:{
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});

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
              product_image: prod.product_image, 
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

router.post('/', login.obligatory, upload.single('productImage'),  (req, res, next) => {
  console.log(req.user)
  mysql.getConnection((error, conn) => {
    console.log(req.file);
    if(error){return res.status(500).send({ error : error})}
    conn.query(
      'INSERT INTO products (name, price, product_image) VALUES (?,?, ?)',
      [
        req.body.name, 
        req.body.price,
        req.file.path
      ],
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
            product_image: req.file.path,
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
            product_image: result[0].product_image, 
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

router.patch('/', login.obligatory,(req, res, next) => {
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
          mensagem:'Dados do produto atualizados com sucesso',
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

router.delete('/', login.obligatory, (req, res, next) => {
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