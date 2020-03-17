var mysql = require("mysql");
var inquirer = require("inquirer");
require('dotenv').config()


// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
    if (err) {
      console.error("error");
    }
    start();
  });
  
  function start() {
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        if (err) throw err;
        for (i = 0; i < res.length; i++) {
            console.log("Product ID: " + res[i].id + "\nName: " + res[i].product_name +
                "\nPrice: " + res[i].price + "\n \n");
        }
        runQuery();
    });
}

function runQuery() {
    inquirer.prompt([{
            type: "input",
            name: "id",
            message: "Please enter the ID of the product.",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "Please enter quantity of the product",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }

    ]).then(function(answers) {
        
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { id: answers.id }, function(err, res) {
            if (err) throw err;
            var id = res[0].id;
            
            var newQuant = res[0].stock_quantity - answers.quantity,
                orderPrice = res[0].price * answers.quantity;
            var totalSales = res[0].product_sales + orderPrice;
            if (res[0].stock_quantity < answers.quantity) {
                console.log("Insufficient Quantity!");
                connection.end();
            } else {
                
                connection.query('UPDATE products SET ? WHERE id = ?', [{ stock_quantity: newQuant, product_sales: totalSales }, id],
                    function(err, res) {
                        console.log("Cost Total: $" + orderPrice);
                        inquirer.prompt([{
                            name: "validate",
                            type: "validate",
                            message: "Would you like to process purchase?"
                        }]).then(function(answers) {
                            if (answers.confirm === true) {
                                displayProducts();
                            } else {
                                connection.end();
                            }
                        })

                    });
            }
        });
    })

}