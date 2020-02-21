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
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./generateHTML");
const fs = require("fs");
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);
const pdf = require("html-pdf");

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


function writeToFile(info) {
    console.log("write to file")
    const html = generateHTML(info);
    writeFileAsync("index.html", html);
    convertToPDF(html);

};


function convertToPDF(htmlPdf) {
    options = { format: 'Letter' };
    pdf.create(htmlPdf, options).toFile('../Assets/resume.pdf', function(err, res) {
        if (err)
            return console.log(err);
        console.log("Pdf Successfully generated", res);
    });
}

function init() {
    inquirer
        .prompt(questions)
        .then(function({ username, color }) {
            console.log(username, color, "prompt answers");
            const queryUrl = `https://api.github.com/users/${username}`;

            axios
                .get(queryUrl)
                .then((res) => {
                    //console.log(res.data, "response 1 data")

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

                    console.log(data.color, "the color is a number");



                    data.username = username;
                    data.numOfRepo = res.data.public_repos;
                    data.name = res.data.name;
                    data.followers = res.data.followers;
                    data.following = res.data.following;
                    data.portPic = res.data.avatar_url;
                    data.location = res.data.location;
                    data.blog = res.data.blog;
                    data.company = res.data.company;
                    data.bio = res.data.bio;




                })
                .then(function() {
                    console.log(`Successful 1st axios call and prompts`, data)


                })
                .catch(function(error) {
                    console.log("please enter a valid Github username", error);
                    return
                });
        })
        .then(function(username) {
            axios // axios call a to get stars
                .get(`https://api.github.com/users/${username}/repos?per_page=100`)
                .then((res) => {
                    console.log("2nd axios call successful");
                    data.stars = 0;
                    for (let i = 0; i < res.data.length; i++) { // Loop through each repository and count the number of stars
                        data.stars += res.data[i].stargazers_count;
                    };
                })

            .then(function() {
                    console.log(data, "#2 hey check your data");
                    writeToFile(data);

                })
                .catch(function(error) {
                    console.log("did not write to html and convert to pdf", error);
                    return
                });
            /*  let resumeHTML = generateHTML(data);
                        // console.log(resumeHTML)
    
                        conversion({ html: resumeHTML }, function(err, result) {
                            if (err) {
                                return console.error(err);
                            }
    
    
                            console.log(result.numberOfPages);
                            console.log(result.logs);
                            result.stream.pipe(fs.createWriteStream('../Assets/resume.pdf'));
                            conversion.kill(); // necessary if you use the electron-server strategy, see bellow for details
                                */


        });

};

//starts process 
init();