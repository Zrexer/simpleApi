const express = require('express')();
const dns = require("dns");
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

function getDomainIP(domain){
    dns.lookup(domain, (err, addr) => {
        if (err){
            return err;
        }

        return addr;
    })
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
