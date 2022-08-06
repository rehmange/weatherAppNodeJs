//website name is openweather

const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync('home.html', 'utf-8');

const replaceVal=(tempVal,orgVal)=>{
    let temperature = tempVal.replace("{%city%}",orgVal.name)
     temperature = temperature.replace("{%deg%}",Math.round(orgVal.main.temp-273.15))
     temperature = temperature.replace("{%weatherstatus%}",orgVal.weather[0].main)
     temperature = temperature.replace("{%country%}",orgVal.sys.country)
     temperature = temperature.replace("{%tempmin%}",Math.round(orgVal.main.temp_min-273.15))
     temperature = temperature.replace("{%tempmax%}",Math.round(orgVal.main.temp_max-273.15))
     temperature = temperature.replace("{%feels%}",Math.round(orgVal.main.feels_like-273.15))
     
    return temperature
};

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests('https://api.openweathermap.org/data/2.5/weather?lat=29.6133&lon=73.1389&appid=94080e363087ceeefc95f99ef8c5f1dc')
            .on('data', function (chunk) {
                let dataObj = JSON.parse(chunk)
                let arrayObj = [dataObj];
                const realTimeData = arrayObj.map((data)=>replaceVal(homeFile,data)).join("")
                // console.log(realTimeData)
                res.write(realTimeData)
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
                console.log('end');
            });
    }


})

server.listen(8000,'127.0.0.1',()=>{
    console.log('http://127.0.0.1:8000')
})
