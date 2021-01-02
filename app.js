const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const team = [];

function addEmployee() {
    inquirer.prompt([{
        message: "Enter the employees name:",
        name: "name",
        default: "FirstName LastName"
    },
    {
        message: "Enter their employee ID:",
        name: "id",
        default: "Employee ID"
    },
    {
        type: "list",
        message: "What is the employee's role?",
        name: "role",
        choices: ["Manager", "Engineer", "Intern"]
    },
    {
        message: "Enter the employee's email address",
        name: "email",
        default: "email@email.com"

    }]).then(function ({ name, id, role, email }) {
        let roleInfo = "";
        if (role === "Engineer") {
            roleInfo = "GitHub username:";
        } else if (role === "Intern") {
            roleInfo = "school name:";
        } else {
            roleInfo = "office phone number:";
        }
        inquirer.prompt([{
            message: `Enter the team member's ${roleInfo}`,
            name: "roleInfo"
        },
        {
            type: "confirm",
            message: "Would you like to add more employees?",
            name: "moreEmployees"
        }])
            .then(function ({ roleInfo, moreEmployees }) {
                let newEmployee;
                if (role === "Engineer") {
                    newEmployee = new Engineer(name, id, email, roleInfo);


                } else if (role === "Intern") {
                    newEmployee = new Intern(name, id, email, roleInfo);

                } else {
                    newEmployee = new Manager(name, id, email, roleInfo);
                }

                team.push(newEmployee);

                if (moreEmployees) {
                    addEmployee();

                } else {
                    renderHtml();
                }
            });

    });
};


function renderHtml() {
    const newHtml = render(team);
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFile(outputPath, newHtml, function (err) {
        if (err) {
            console.log(err)
        }
    });
};

function init() {
    addEmployee();
}

init();