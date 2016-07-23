create database bamazon;
use bamazon;

create table Products (
  ItemID int auto_increment not null,
    ProductName varchar(200),
    DepartmentID int not null,
    Price decimal(25,2),
    StockQuantity decimal(30,0),
    primary key (ItemID)
);

insert into Products (ProductName, DepartmentID, Price, StockQuantity) values ("Common Core Maths",1,23.50,40);
insert into Products (ProductName, DepartmentID, Price, StockQuantity) values ("Samsung TV",2,560.00, 150);
insert into Products (ProductName, DepartmentID, Price, StockQuantity) values ("Bose Headphones",2,99.00,3);
insert into Products (ProductName, DepartmentID, Price, StockQuantity) values ("Farberware Non-Stick Cookware",3, 34.45, 12);
insert into Products (ProductName, DepartmentID, Price, StockQuantity) values ("Tide Cleaner",4, 12.34, 15);


create table Department (

  DepartmentID int not null,
    Department varchar(200) null
);

insert into Department values (1, "Books");
insert into Department values (2, "Electronics");
insert into Department values (3, "Cookware");
insert into Department values (4, "Groceries");

