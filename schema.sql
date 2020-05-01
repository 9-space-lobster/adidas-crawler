DROP DATABASE IF EXISTS adidas;

CREATE DATABASE adidas;

USE adidas;

CREATE TABLE products(
  id varchar(20) NOT NULL,
  name varchar(50) NOT NULL,
  price varchar(50),
  picture varchar(200),
  highlights varchar(3000),
  description varchar(3000),
  spec varchar(3000),
  story varchar(3000)
);

CREATE TABLE relatedProducts(
  fromProductId varchar(20) NOT NULL,
  toProductId varchar(20) NOT NULL,
  relationType varchar(20)
);

CREATE TABLE likes(
  sessionId varchar(50),
  productId varchar(20),
  disabled boolean
);

CREATE TABLE completeTheLook(
  fromProductId varchar(20) NOT NULL,
  toProductId varchar(20) NOT NULL
);

CREATE TABLE inventories(
  productId varchar(20),
  size varchar(5),
  inventory int
);

CREATE TABLE feedbacks(
  id int NOT NULL AUTO_INCREMENT,
  sessionId varchar(50),
  score int,
  comment varchar(200),
  age int,
  gender varchar(10),
  name varchar(20),
  availibility int,
  timezone int,
  phoneno varchar(20),
  PRIMARY KEY (ID)
);


