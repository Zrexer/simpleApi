#!/usr/bin/env node 

//----[ Modules ]----
const alex = require('./node_modules/alexcolor/alexcolor/index');
const express = require('express')();
const fs = require('fs');
const request = require("./node_modules/request/index");
const time = new Date();
const https = require("https");
const http = require("http");
const { exec } = require("child_process");

//----[ Variables ]----
let somewhere = [];
let howMuchConnection = 0;

//----[ Data ]----
const host = "127.0.0.1";
const port = 4646;

//----[ Started Data ]----
const data = {
    "hostName" : host,
    "port" : port,
    "starterTime" : time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()
};

//----[ Data Controller ]----
class ControlData{
    constructor(){
        this.base = {
            'Dev' : "Host1let"
        };
    }

    addData(key, value){
        try{
            this.base[key] = value;
            return JSON.parse(JSON.stringify({"status" : true, "main" : this.base}));
        }catch (error){
            return JSON.parse(JSON.stringify({"status" : false, "main" : error}));
        }
    }

    deleteData(key){
        try{
            delete this.base[key];
            return JSON.parse(JSON.stringify({"status" : true, "main" : this.base}));
        }catch (error){
            return JSON.parse(JSON.stringify({"status" : false, "main" : error}));
        }
    }

    changeData(key, value){
        try{
            this.base[key] = value;
            return JSON.parse(JSON.stringify({"status" : true, "main" : this.base}));
        }catch (error){
            return JSON.parse(JSON.stringify({"status" : false, "main" : error}));
        }
    }

    allKeys(){
        return JSON.parse(JSON.stringify({"status" : true, "main" : Object.keys(this.base)}));
    }

    allValues(){
        return JSON.parse(JSON.stringify({"status" : true, "main" : Object.values(this.base)}));
    }

    clearAllData(){
        let so = [];

        for (let k in this.base){
            so.push(k);
        }

        for (let i = 1; i < so.length; i++){
            delete this.base[so[i]]
        }

        return JSON.parse(JSON.stringify({"status" : true, "main" : this.base}));
    }
}

//----[ Call Class ]----
const controller = new ControlData();

//----[ Create Random INT Data]----
function rc(){
    exec("python handlerint.py", (err, stdout, stderr) => {
    somewhere.push(stdout);
    //console.log(somewhere[somewhere.length - 1]);
    return somewhere[somewhere.length - 1];
    });
}

//----[ Create a Random String Data ]----
function generateRandomString(len) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
};

//----[ Go On Listen Mode ]----
express.listen(port, host, () => {
    console.log(alex.blue("Running ON ") + alex.red(host+alex.yellow(":")+alex.red(port)));
    console.log(JSON.parse(JSON.stringify(data)));
    console.log("\n");
})

//----[ Chat GPT ]----
express.get("/gpt", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/gpt")+  alex.yellow(" ]"));
   
    const text = req.query.text;
    if (text === undefined){
        res.send(
            {
                'Dev' : "Host1let",
                'data' : "Please Set the Text Parameter: /gpt4?text=Hello"
            }
        )
    }else{
        https.get(`https://haji-api.ir/Free-GPT3/?text=${text}&key=hajiapi`, (result) => {
            result.on('data', (ch) => {
                res.send(
                    {
                        'Dev' : "Host1let",
                        'ThanksTo' : "HajiAPI",
                        'data' : JSON.parse(ch).result.answer
                    }
                );
            })
        })
    }
})

//----[ Random String ]----
express.get("/random/str", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/random/str")+  alex.yellow(" ]"));
 
    const much = req.query.much;
    rc();

    if (much === undefined){
        controller.clearAllData();
        controller.addData("data", generateRandomString(parseInt(String(somewhere[somewhere.length - 1]).replace("\n", "").replace("\r", ''))));
        controller.addData('dataType', "string");
        res.send(controller.addData('dataLength', String(somewhere[somewhere.length - 1]).replace("\n", "").replace("\r", '')).main);

    }else{
        controller.clearAllData();
        controller.addData("data", generateRandomString(parseInt(much)));
        controller.addData("dataType", "string");
        res.send(controller.addData('dataLength', much).main);
    }
})

//----[ Wikipedia Searcher ]----
express.get("/wiki", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/wiki")+  alex.yellow(" ]"));
 
    const q = req.query.query;
    if (q === undefined) {
       controller.clearAllData();
       controller.addData("ThanksTo", "CodeBazan");
       controller.addData("data", "Error; Please Set the query Like: /wiki?query=Iran");
       res.send(controller.addData('dataType', "string").main);

    }else{
        http.get(`http://api.codebazan.ir/wiki/?search=${q}`, (resx) => {
            let d = '';

            resx.on("data", (ch) => {
                d += ch;
            })

            resx.on("end", () => {
                controller.clearAllData();
                controller.addData("ThanksTo", "CodeBazan");
                controller.addData("data", d);
                res.send(controller.addData("dataType", "string").main)
            })
        })
    }
})

