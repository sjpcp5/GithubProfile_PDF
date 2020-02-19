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
const fs = require("fs");
const axios = require("axios");
const pdfConvertor = require("electron-html-to");

let profile = {};

const questions = [{
        type: "input",
        message: "What is your github username?",
        name: "username"
    },
    {
        type: "list",
        message: "Choose your favorite color.",
        name: "color",
        choices: ['red', 'green', 'orange', 'blue', 'purple']

    }
];

function writeToFile(fileName, data) {

}

function init() {

    init();