const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');

const laptopData = JSON.parse(json);



const server = http.createServer((req, res) => {
    
    const pathName = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
  
    
    if(pathName === '/products' || pathName === '/'){
        
        res.writeHead(200, { 'Content-type': 'text/html'});
        
        fs.readFile(`${__dirname}/templates/overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/templates/cards.html`, 'utf-8', (err, data) => {
               
                let cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput);

                res.end(overviewOutput)
                
            })
        })

    } else if (pathName === '/laptop' && id < laptopData.length){
        res.writeHead(200, { 'Content-type': 'text/html'});
        fs.readFile(`${__dirname}/templates/laptop.html`, 'utf-8', (err, data) => {
            
            const laptop = laptopData[id];
            
            let output = replaceTemplate(data, laptop);
            
            res.end(output)
        })

    } else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)) {
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200, { 'Content-type': 'img/jpg'});
            res.end(data)
        })

    } else {
        res.writeHead(404, { 'Content-type': 'text/html'});
        res.end('No page found');
    }

    
})



server.listen(1337, '127.0.0.1', () => {
    console.log('Yep working');
});



const replaceTemplate = (data, laptop) => {
                
    let output = data.replace(/{%PRICE%}/g, laptop.price);  
    output = output.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%ID%}/g, laptop.id);
    
    return output;
}