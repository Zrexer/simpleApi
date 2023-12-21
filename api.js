const alex = require('alexcolor');
const express = require('express')();
const dns = require("dns");
const https = require("https");
const http = require('http');
const { exec } = require("child_process");

const port = 4646;
var something = 0;
let somewhere = [];

function rc(){
    exec("python handlerint.py", (err, stdout, stderr) => {
    somewhere.push(stdout);
    console.log(somewhere[somewhere.length - 1]);
    return somewhere[somewhere.length - 1];
    });
}

function generateRandomString(len) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  
    for (let i = 0; i < len; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
};

function randomInt(x){
    const randomNumber = Math.floor(Math.random() * x) + 1;

    return randomNumber;
}

express.listen(port, () => {
    console.log(`Server Running on ${port}`);
})

express.get("/randomint", (req, res, nx) => {
    something += 1;
    console.log(`The ${alex.red(something)} is Connected To Server`);
    console.log(`Request for ${alex.green("/randomint")}\n`);

    var op = Math.random();

    res.send(
        {
            "Dev" : "Host1let",
            "data" : String(op)
        }
    );
})

express.get("/randomstr", (req, res, nx) => {
    something += 1;
    console.log(`The ${alex.red(something)} is Connected To Server`);
    console.log(`Request for ${alex.green("/randomstr")}\n`);

    const much = req.query.much;

    rc();

    if (much === undefined){
        res.send(
            {
                'Dev' : "Host1let",
                "data" : generateRandomString(String(somewhere[somewhere.length - 1]).replace("\n", "").replace("\r", '')),
                "dataType" : "string",
                "dataLength" : String(somewhere[somewhere.length - 1]).replace("\n", "").replace("\r", '')
            }
        );
    }else{
        res.send(
            {
                'Dev' : "Host1let",
                "data" : generateRandomString(parseInt(much)),
                "dataType" : "string",
                "dataLength" : much
            }
        );
    }
})

express.get("/lookup", (req, res, nx) => {
    something += 1;
    console.log(`The ${alex.red(something)} is Connected To Server`);
    console.log(`Request for ${alex.green("/lookup")}\n`);

    const domainForScan = req.query.domain;

    if (domainForScan === undefined){
        res.send(
            {
                'Dev' : "Host1let",
                "data" : "Please Set the Host: /lookup?domain=DOMAIN"
            }
        )
    }else{
        dns.lookup(domainForScan, (err, addr) => {
        if (err){
            res.send(
                {
                    'Dev' : "Host1let",
                    "data" : err
                }
            )
        }else{
            res.send(
                {
                    'Dev' : "Host1let",
                    "data" : addr
                    }
                )
            }
        })

    }
})

express.get("/gpt4", (req, res, nx) => {
    something += 1;
    console.log(`The ${alex.red(something)} is Connected To Server`);
    console.log(`Request for ${alex.green("/gpt4")}\n`);
    
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

