const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mysqlpassword",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

function start() {
  inquirer
    .prompt({
      type: "list",
      message: "What do you want to do in your employee database?",
      name: "option",
      choices: [
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update employee roles",
        "View all employees",
        "View all departments",
        "View all role types",
        "View all company information",
        "Exit",
      ],
    })
    .then(function (res) {
      if (res.option === "Add an employee") {
        addEmployee();
      } else if (res.option === "Add a department") {
        addDepartment();
      } else if (res.option === "Add a role") {
        addRoles();
      } else if (res.option === "Update employee roles") {
        updateEmployeeRoles();
      } else if (res.option === "View all employees") {
        viewAllEmployees();
      } else if (res.option === "View all company information") {
        viewAllInfo();
      } else if (res.option === "View all departments") {
        viewEmployeeByDepartment();
      } else if (res.option === "View all role types") {
        viewRoles();
      } else {
        connection.end();
      }
    });
}

function viewAllInfo() {
  connection.query(
    "Select employee.id AS employee_id, employee.first_name AS firstname, employee.last_name AS lastname, roles.title, roles.salary, department.department_name, employee_m.first_name as manager_firstname, employee_m.last_name as manager_lastname\
    from employee \
    join roles on employee.role_id = roles.id\
    join department on roles.department_id = department.id\
    Left join employee as employee_m on  employee.manager_id  = employee_m.id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
  start();
}

function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  start();
}

function viewRoles() {
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    console.table(res);
  });
  start();
}

function viewEmployeeByDepartment() {
  connection.query(
    // need a JOIN QUERY for employees in different departments
    "select * from department;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
    }
  );
  start();
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "What is the new department?",
      },
    ])
    .then(function (res) {
      console.log("Inserting a new Dept...\n");
      var query = connection.query(
        "INSERT INTO department SET ?",
        {
          department_name: res.departmentName,
        },
        function (err, res) {
          if (err) throw err;
          console.log(res.affectedRows + " department inserted!\n");
        }
      );
      start();
    });
}

function addRoles() {
  var deptArray = [];
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the new role?",
        },
        {
          type: "number",
          name: "salary",
          message: "What is the new salary?",
        },
        {
          type: "list",
          name: "department",
          message: "What department does this role belong to?",
          choices: function () {
            for (var i = 0; i < res.length; i++) {
              deptArray.push(res[i].department_name);
            }
            return deptArray;
          },
        },
      ])
      .then(function (reply) {
        let deptId;
        console.table("Adding a new employee...\n");
        res.forEach((department) => {
          if (department.department_name === reply.department) {
            console.log(department.id);
          }
          deptId = department.id;
        });
        console.log("Inserting a new Role...\n");
        var query = connection.query(
          "INSERT INTO roles SET ?",
          {
            title: reply.title,
            salary: reply.salary,
            department_id: deptId, // not correct but a placeholder, need correct dept id
          },
          function (err, res) {
            if (err) throw err;
            start();
          }
        );
        console.log(query.sql);
        start();
      });
  });
}

// bonus
// update employee managers
// view employees by manager
// delete dept, roles, employees
// view total depart salaries

function addEmployee() {
  let roleArray = [];
  connection.query("SELECT * FROM roles", function (err, res) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "What is your new employees first name?",
        },
        {
          name: "lastName",
          type: "input",
          message: "Add your employee's last name.",
        },
        {
          type: "list",
          name: "role",
          message: "Choose the role",
          choices: function () {
            for (var i = 0; i < res.length; i++) {
              roleArray.push(res[i].title);
              console.log(roleArray);
            }
            return roleArray;
          },
        },
        // {
        //   type: "list",
        //   message: "Who is their manager?",
        //   name: "manager",
        //   // update the choices to pull from the database by manager_id
        //   choices: ["Hermione Granger", "Luna Lovegood", "NULL"],
        // },
      ])
      .then(function (reply) {
        let roleId;
        // let managerId;
        console.table("Adding a new employee...\n");
        res.forEach((role) => {
          console.log(role.title === reply.role);
          if (role.title === reply.role) {
            console.log(role.id);
          }
          roleId = role.id;
        });
        // roles.forEach((manager) => {
        //   //console.log(role.title === reply.role);
        //   if (manager.id === reply.manager) {
        //     console.log(manager.id);
        //   }
        //   roleId = manager.id;
        // });
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: reply.firstName,
            last_name: reply.lastName,
            role_id: roleId,
            // manager_id: managerId,
          },
          function (err, res) {
            if (err) throw err;
            console.table(res.affectedRows + "employee added \n");
            start();
          }
        );
      });
  });
}

// function updateEmployeeRoles() {
//   let employeeArray = [];
//   connection.query("SELECT * FROM employee", function (err, employee) {
//     if (err) throw err;
//     for (var i = 0; i < employee.length; i++) {
//       employeeArray.push(employee[i].title);
//     }
//     inquirer
//       .prompt([
//         {
//           name: "employee",
//           type: "list",
//           message: "Which employee would you like to edit their role?",
//           choices: employeeArray,
//         },
//         {
//           name: "title",
//           type: "list",
//           message: "What is your employees new role?",
//           choices: ["Cashier", "Manager", "Janitor", "Talent"],
//         },
//       ])
//       .then(function (reply) {
//         var query = connection.query(
//           "UPDATE employee SET ? WHERE ?",
//           [
//             {
//               role_id: 100,
//             },
//             {
//               first_name: x,
//             },
//           ],
//           function (err, res) {
//             if (err) throw err;
//             console.table(res.affectedRows + "employee added \n");
//             start();
//           }
//         );
//       });
//   });
// }
