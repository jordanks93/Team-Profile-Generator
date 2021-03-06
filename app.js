const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// array to store team object for render html
const team = [];

//prompt user for employee info
const createTeam = () => {
    inquirer.prompt([{
        message: "Enter the employee's name:",
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

        // additonal prompt depending on the employee's role
    }]).then(({ name, id, role, email }) => {
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

            // create new employee objects and add to team array
        }]).then(({ roleInfo, moreEmployees }) => {
                let newEmployee;
                if (role === "Engineer") {
                    newEmployee = new Engineer(name, id, email, roleInfo);

                } else if (role === "Intern") {
                    newEmployee = new Intern(name, id, email, roleInfo);

                } else {
                    newEmployee = new Manager(name, id, email, roleInfo);
                }

                // add new emloyee to array
                team.push(newEmployee);

                // if user wants to add more employees, user will be prompted for employee info more
                if (moreEmployees) {
                    createTeam();
                
                // if user is done, html render function will execute
                } else {
                    renderHtml();
                }
            });

    });
};

// write to html with team object info
const renderHtml = () => {
    let newHtml = render(team);

    // check if out folder exists and creates one if not
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    // write html file
    fs.writeFile(outputPath, newHtml, (err) => {
        if (err) {
            throw(err);
        } else {
            console.log("team.html was created. (Look in the output folder)");
        }
    });
};


function init() {
    createTeam();
}

// run code
init();