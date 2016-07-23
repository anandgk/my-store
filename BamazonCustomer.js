
// Requires Section
var table = require('easy-table');
var prompt = require('prompt');
var connection = require('./connections.js')();

// Customer prompt questions
var schema = {
  properties: {
    itemID: {
      description: 'Enter Item Id or Q to quit ',
    },
    itemQuantity: {
      description: 'Enter Item Quantity ',
      ask: function() { 
        return prompt.history('itemID').value != "Q";
      }
    }
  }
};

// Main Program
bamazon = {

  // Get connection
  dbConnection : connection.getMySQLConnection(), 

  // Start shopping
  startShop : function() {
    
    this.displayProducts();

  }, 

  // Display available products
  displayProducts : function()  {

    var local = this;

    var query = 'SELECT a.ItemID, a.ProductName, b.Department, a.Price, a.StockQuantity FROM Products a, Department b where a.DepartmentID = b.DepartmentID';
    var t = new table;
    
    local.dbConnection.query(query, function(err, res) {

      res.forEach(function(product) {
        t.cell('ItemID', product.ItemID);
        t.cell('ProductName', product.ProductName);
        t.cell('DepartmentName', product.Department);
        t.cell('Price', product.Price);
        t.cell('StockQuantity', product.StockQuantity);
        t.newRow();
      });

      console.log(t.toString());

      local.askCustomer();
      
    });
  },

  // Ask customer to begin order process
  askCustomer : function()  {

    local = this;

    prompt.get(schema, function(err, result) {

      var query = "";
      var queryResult = "";

      // If Q is entered then quit the process
      if ( result.itemID === "Q") {
        process.exit();
      } else {
        
        // Get product information for the item number entered by customer
        query = `SELECT a.ItemID, a.ProductName, b.Department, a.Price, a.StockQuantity FROM Products a, Department b where a.DepartmentID = b.DepartmentID and a.ItemId = ${result.itemID}`; 
        local.dbConnection.query(query, function(err, res) {
          
          // Check if quantity entered by customer is more than available quantity
          if ( result.itemQuantity > res[0].StockQuantity ) {

            // Display message if ordered quantity is more than available quantity
            console.log(`CustomerService: Specifed quantity ${result.itemQuantity} not availble for item ${result.itemID}. Please select again.`);

            // Prompt customer again
            local.askCustomer();

          } else  {

            // Display order details and total cost for the order
            console.log("           Order Total");
            console.log("-----------------------------------");
            console.log(`Product Name: ${res[0].ProductName}`);
            console.log(`Item Price: $${res[0].Price}`);
            console.log(`Total Quantity Ordered: ${result.itemQuantity}`);
            var orderCost = res[0].Price * result.itemQuantity;
            console.log(`Total Order Cost: $${orderCost}`);
            console.log("-----------------------------------");

            // Perform update to Product table
            query = `UPDATE Products set StockQuantity = StockQuantity - ${result.itemQuantity} where ItemID = ${result.itemID}`; 
            local.dbConnection.query(query, function(err, res) {

              // Display error message if there was issue with update query
              if ( err ) {
                console.log('CustomerService: Error with order. Please try again.');
              }
            });

            // Prompt customer again
            local.askCustomer();
          }
        });
      }
    });
  }
};

// Program entering for first time
bamazon.startShop();
