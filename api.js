#!/usr/bin/env node 

//----[ Modules ]----
const alex = require('alexcolor/alexcolor');
const express = require('express')();
const time = new Date();
const fs = require('fs');
const https = require("https");
const http = require("http");
const geoip = require("geoip-lite");
const { exec } = require("child_process");

//----[ Infos ]----
__version__ = "3.0.4";
__dev__ = "Host1let";
__poweredby__ = "NodeJs";
__description__ = "a simple Api with simple Function"

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

//----[ Downloader ]----
function DownloadFileUrl(urlToDownload){
    return new Promise((resv, rej) => {
        if (String(urlToDownload).startsWith("https")){
            try{
                const destinationPath = "./" + String(urlToDownload).split("/")[String(urlToDownload).split("/").length - 1];
                console.log(destinationPath)
                https.get(urlToDownload, (response) => {
                    const writeStream = fs.createWriteStream(destinationPath);
                    response.pipe(writeStream);
                    writeStream.on('finish', () => {
                        resv(JSON.parse(JSON.stringify({
                            "path" : destinationPath,
                            "url" : urlToDownload,
                            "method" : "https",
                            "fileName" : String(urlToDownload).split("/")[String(urlToDownload).split("/").length - 1],
                            "error" : false
                        })));
                });
            }).on('error', (erx) => {
                rej(erx)
            })
        }catch (err){
            rej(err)
        }
    }else if(String(urlToDownload).startsWith("http")){
        try{
            const destinationPath = "./" + String(urlToDownload).split("/")[String(urlToDownload).split("/").length - 1];
            console.log(destinationPath)
            http.get(urlToDownload, (response) => {
                const writeStream = fs.createWriteStream(destinationPath);
                response.pipe(writeStream);
                writeStream.on('finish', () => {
                    resv(JSON.parse(JSON.stringify({
                        "path" : destinationPath,
                        "url" : urlToDownload,
                        "method" : "http",
                        "fileName" : String(urlToDownload).split("/")[String(urlToDownload).split("/").length - 1],
                        "error" : false
                    })));
            });
        }).on('error', (erx) => {
            rej(erx)
        })
    }catch (err){
        rej(err)
        }
    }else{
        rej(JSON.parse(JSON.stringify({
            'error' : true,
            'main' : "please set the http or https"
        })))
    }
        
})}

//----[ Read a File ]----
function ReadFile(pathToRead){
    return new Promise((resv, rej) => {
        try{
            fs.readFile(pathToRead, (err, data) => {
                resv(data);
            });
        }catch (err){
            rej(err)
        }
    }
)}

//----[ IP Information Extracter ]----
function IPExtract(ip){
    const geo = geoip.lookup(ip);

    return JSON.parse(JSON.stringify(
        {
            "country" : geo.country,
            "city" : geo.city,
            'area' : geo.area,
            'timezone' : geo.timezone,
            'metro' : geo.metro,
            'range' : geo.range,
            'region' : geo.region,
            'll' : geo.ll,
            'eu' : geo.eu
        }
    ))
}

//----[ Go On Listen Mode ]----
express.listen(port, host, () => {
    console.log(alex.blue("Running ON ") + alex.red(host+alex.yellow(":")+alex.red(port)));
    console.log(JSON.parse(JSON.stringify(data)));
    console.log("\n");
})

//----[ Chat GPT 1 ]----
express.get("/gpt1", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/gpt1")+  alex.yellow(" ]"));
   
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

//----[ Chat GPT 2 ]----
express.get("/gpt2", (req, res, nx) => {
  howMuchConnection += 1;
  console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/gpt2")+  alex.yellow(" ]"));
  
  const text = req.query.text;
  
  if (text === undefined){
    controller.clearAllData();
    controller.addData("data", "Please Set the text parameter");
    res.send(controller.base);
  }else{
    http.get(`http://arver.ir/chatbot/api.php?text=${text}`, (result) => {
      let data = "";
      
      result.on("data", (ch) => {
        data += ch;
      })
      
      result.on("end", () => {
        controller.clearAllData();
        controller.addData("data", data);
        res.send(controller.base)
      })
    }).on("error", (err) => {
      controller.clearAllData();
      controller.addData("data", err);
      res.send(controller.base);
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

//----[ File Reader ]----
express.get("/reader/file", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/read/file")+  alex.yellow(" ]"));

    const urlClient = req.query.urlFile;

    if (urlClient === undefined){
        controller.clearAllData();
        controller.addData("data", "Please Set url Like: /reader/file?urlFile=https://example.com/file.txt");
        res.send(controller.base)
    }else{
        DownloadFileUrl(urlClient).then((dataToDl) => {
            controller.clearAllData();
            controller.addData("info", dataToDl);
            ReadFile("./"+dataToDl.path).then((dataToRead) => {
                controller.addData("data", String(dataToRead));
                res.send(controller.base)
                fs.unlink(dataToDl.path, (err) => {
                    if (err){
                        console.log(err);
                    }
                });
            })
        })
    }
})

//----[ Music Downloader (local) ]----
express.get("/music", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/music")+  alex.yellow(" ]"));

    const musicData = {
        'pishro-ghabrestoone-hip-hop-1' : "https://s2.pr3m.ir/Music/1399/5/Pishro%20-%20Ghabrestoone%20Hip%20Hop.mp3",
        "fadaei-tablo-shode" : "http://dl.parsiamusic.ir/99/03/Fadaei%20-%20Dige%20Tablo%20Shode.mp3",
        "pishro-shafa" : "https://dl.musicgraaphy.com/Music/1401/11/Reza%20Pishro/Reza%20Pishro%20_%20Shafa%20%28320%29.mp3",
        "pishro-ghabrestoone-hip-hop-2" : "https://dl.sultanmusic.ir/music/1402/5/1/Reza%20Pishro%20-%20Ghabrestoone%20HipHop%202.mp3",
        "fadaei-blit" : "http://dl.parsiamusic.ir/00/05/Fadaei%20-%20Bilit.mp3"
    };
    const musicName = req.query.musicName; 

    if (musicName === undefined){
        controller.clearAllData();
        controller.addData("data", "Please Set a Name For Music, Example: /music?musicName=pishro-ghabrestoone-hip-hop || for see the list of musics: /music?musicName=help")
        res.send(controller.base)
    }else if (Object.keys(musicData).includes(musicName)){
        DownloadFileUrl(musicData[musicName]).then((data) => {
				controller.clearAllData();
				controller.addData("data", data);
				res.send(controller.base)
		})
    }else if (musicName === "help"){
        controller.clearAllData();
        controller.addData("data", Object.keys(musicData));
        res.send(controller.base);
    }else{
        controller.clearAllData();
        controller.addData("data")
    }
})

//----[ IP Information ]----
express.get("/ipextract", (req, res, nx) => {
    howMuchConnection += 1;
    console.log(alex.yellow("{ ") + alex.green(`${howMuchConnection} `) + alex.yellow("} ") + alex.blue("Requested For ") + alex.yellow("[ ") + alex.red("/ipextract")+  alex.yellow(" ]"));

    const targetIP = req.query.ip; 
    if (targetIP === undefined){
        controller.clearAllData();
        controller.addData("data", "Please Set IP, Example: /ipextract?ip=1.1.1.1");
        res.send(controller.base);
    }else{
        const myd = IPExtract(targetIP);
        controller.clearAllData();
        controller.addData("data", myd);
        res.send(controller.base);
    }
})
