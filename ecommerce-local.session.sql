      SELECT  requests.request_id,
              request.quantity,
              products.product_id,
              products.name,
              products.price,
        FROM  requests 
  INNER JOIN  products 
          ON  product_id = products.product_product_id; 