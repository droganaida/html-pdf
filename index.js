
const http = require('http');
const fs = require('fs');
const port = 6006;
const htmlPdf = require('html-pdf');
const ejs = require('ejs');

const requestHandler = (request, response) => {

    if (request.url.indexOf('.') != -1){

        response.end(fs.readFileSync(__dirname + request.url));

    } else {

        let date = new Date();
        let month = date.getMonth() + 1;
        month = (month < 10 ? '0' + month : month);
        let day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        date = day + '.' + month + '.' + date.getFullYear();

        const params = {
            name: "Аида Дроган",
            email: "aida.drogan.box@gmail.com",
            id: "127001",
            company: "#BlondieCode",
            logo: "/images/logo.png",
            date: date,
            quantity: 1,
            price: 66,
            currency: "BTC",
            product: "Вундер-Вафля (меч, серебро)",
            units: "штука"
        };

        ejs.renderFile(__dirname + '/template.ejs', params, (err, html) => {

            const options = { format: 'A4'};
            const fileName = __dirname + '/file.pdf';

            const renderHtml = html.replace(/img src=\"\//g, 'img src="file://' + __dirname + "/");

            htmlPdf.create(renderHtml, options).toFile(fileName, (err) => {

                if (err) {
                    console.log('Ошибка конвертации', err)
                }

                response.end(html);
            });

        })
    }

};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {

    if (err) {
        return console.log('Ошибка сервера', err)
    }

    console.log(`Вишу на порту ${port}`);
});