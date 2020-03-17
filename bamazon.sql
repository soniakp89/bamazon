DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
  id int(10) NOT NULL AUTO_INCREMENT,
  product_name varchar(45) NOT NULL,
  department_name varchar(45) DEFAULT NULL,
  price int(45) NOT NULL,
  stock_quantity int(45) NOT NULL,
  PRIMARY KEY (id)
)ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
 