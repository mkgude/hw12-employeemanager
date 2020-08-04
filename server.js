// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "mysqlpassword",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
//   console.log("connected as id " + connection.threadId + "\n");
});

function viewAllEmployees() {
  connection.query("SELECT * FROM result", function (err, res) {
    if (err) throw err;
    console.table(res);
    connection.end();
  });
}

function promptUser() {
  return inquirer.prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "function",
      choices: [
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update employee roles",
        "View all employees",
      ],
    },
    // if view all employees display all table data
    // run this function function viewAllEmployees();
  
    // add employee
    {
      type: "input",
      name: "firstName",
      message: "What is the first name of your new employee?",
      // where ...
    },
    {
      type: "input",
      name: "lastName",
      message: "What is the last name of your new employee?",
    },
    {
      type: "list",
      name: "employeeRole",
      message: "What is the role of your new employee?",
      choices: ["Cashier", "Manager", "Talent", "Janitor"],
    },
    {
      type: "list",
      name: "manager",
      message: "Who is their manager?",
      choices: ["Hermione Granger", "Luna Lovegood"],
    },

    // add department
    {
      type: "input",
      name: "departmentName",
      message: "What is the new department?",
      createDept(departmentName) // function
    },

    //add role
    {
      type: "input",
      name: "title",
      message: "What is the new role?",
    },
    {
      type: "number",
      name: "roleSalary",
      message: "What is the new salary?",
    },
    {
      type: "list",
      name: "roleDept",
      message: "What department does this role belong to?",
    },

    // bonus
    // update employee managers
    // view employees by manager
    // delete dept, roles, employees
    // view total depart salaries
  ]);
}
promptUser();

// CREATE HELPER FUNCTIONS

function createDept(deptName) {
  console.log("Inserting a new Dept...\n");
  var query = connection.query(
    // indesert in dept set, name, and other params, DB will handle the IDs, ? is for 32-34 {}
    "INSERT INTO departments SET ?",
    {
      department_name: `${deptName}`,
      // create more lines where the name exactly matches the column name to populate columns
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " department inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      // updateDept();
    }
  );
}

function createRole(){
    console.log("Inserting a new Role...\n");
  var query = connection.query(
    // indesert in dept set, name, and other params, DB will handle the IDs, ? is for 32-34 {}
    "INSERT INTO role SET ?",
    {
      title: `${title}`,
      salary: `${salary}`,
      deptartment_name: `${deptName}`
      // create more lines where the name exactly matches the column name to populate columns
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " role inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      // updateRole();
    }
  );
}

function createEmployee(){
    console.log("Inserting a new Role...\n");
  var query = connection.query(
    // indesert in dept set, name, and other params, DB will handle the IDs, ? 
    "INSERT INTO employee SET ?",
    {
      first_name: `${firstName}`,
      last_name: `${lastName}`,
      role_id: `${employeeRole}`,
      manager_id: `${manager}`
      // create more lines where the name exactly matches the column name to populate columns
    },
    function (err, res) {
      if (err) throw err;
      console.log(res.affectedRows + " role inserted!\n");
      // Call updateProduct AFTER the INSERT completes
      // updateRole();
    }
  );
}

function updateDept();
function updateRole();
function updateEmployee();