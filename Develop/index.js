/* psedud code // require fs and inquirer,
use an axios request to github,
parse JSON data to become object 
find a HTML to PDF converter library
prompt the the user the background color of their choice
prompt the user for their github user name
write var for github url + prompt user name
get dependencies inquirer, axios, html+pdf converter electron-html-to, and fs
write in generateHTML.js next to appropiate html tags ${data.name},

 */
//dependencies
var inquirer = require("inquirer");
var axios = require("axios");
var generateHTML = require("./generateHTML");
var fs = require("fs"),
    convertFactory = require('electron-html-to');


var conversion = convertFactory({
    converterPath: convertFactory.converters.PDF
});

let data = {};

const questions = [{
        type: "input",
        message: "What is your github username?",
        name: "username",
    },
    {
        type: "list",
        message: "Choose your favorite color.",
        choices: ['green', 'blue', 'pink', 'red'],
        name: "color",

    }
];

/* function writeToFile(fileName, data) {

} not neccessary when using electron-hmtl-to*/

function init() {
    inquirer
        .prompt(questions)
        .then(function({ username, color }) {
            console.log(answers, "prompt answers");
            const queryUrl = `https://api.github.com/users/${username}`;

            axios
                .get(queryUrl)
                .then((res) => {
                    console.log(res.data, "response 1 data")

                    switch (color) {
                        case 'green':
                            data.color = 0;
                            break;
                        case 'blue':
                            data.color = 1;
                            break;
                        case 'pink':
                            data.color = 2;
                            break;
                        case 'red':
                            data.color = 3;
                            break;

                    }
                    res.then(function() {
                            console.log(data.color, "color");
                        })
                        .catch(function(err) {
                            console.log(err, " please enter a valid username");
                            return
                        });


                    data.username = username;
                    data.numOfRepo = res.data.public_repos;
                    data.name = res.data.name;
                    data.portPic = res.data.avatar_url;
                    data.location = res.data.location;
                    data.blog = res.data.blog;
                    data.company = res.data.company;
                    data.bio = res.data.bio;

                    axios // axios call a to get stars
                        .get(`https://api/github.com/users/${username}/repos?per_page=100`)
                        .then((res) => {
                            console.log(res)
                            data.stars = 0
                            data.stars.forEach(function(res) {
                                data.stars += res.data[i].stargazers_count;

                            });


                            console.log(data.stars, "response data");



                            let resumeHTML = generateHTML(data);
                            // console.log(resumeHTML)

                            conversion({ html: resumeHTML }, function(err, result) {
                                if (err) {
                                    return console.error(err);
                                }

                                console.log(result.numberOfPages);
                                console.log(result.logs);
                                result.stream.pipe(fs.createWriteStream('../Assets/resume.pdf'));
                                conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details

                            });
                        });



                })

        });
};
//starts process 
init();