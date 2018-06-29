/** This module handles image processign */
module.exports = {
    DetectShoe: function (ImageUrl) {
        return DetectShoe(ImageUrl)
    }
}

var request = require('request')

let DetectShoe = function (ImageUrl, fileName) {
    return new Promise(function (resolve, reject) {
        console.log("Detecting Shoe for img: " + ImageUrl);

        if (process.env.API_SHOE_DETECTOR == null) {
            console.log("YOLO - API_SHOE_DETECTOR not defined");
            return reject(ImageUrl)
        }
        var options = {
            method: 'POST',
            url: process.env.API_SHOE_DETECTOR + "/ImagePreprocess",
            headers: { 'Content-Type': 'application/json' },
            body: { ImageUrl:  ImageUrl, Id: fileName},
            json: true
        };

        request(options, function (err, res, body) {
            if (err || res.statusCode != 200) {
                console.error("YOLO - Can't detect shoe from " + ImageUrl)
                if (err) {
                    console.error(err)
                } else {
                    err = "Status Code - " + res.statusCode + " - " + res.statusMessage
                    console.error(err)
                    console.error(body)
                }
                reject(ImageUrl, fileName)
            }
            else {
                if (body.CroppedImageUrl != "") {
                    console.log("Shoe Detected on /n " + body.CroppedImageUrl)
                    resolve(body.CroppedImageUrl, body.Id)
                } else {
                    Console.log("YOLO - " + body.Message)
                    reject(body.OrigImageUrl, body.Id)
                }
            }
        });
})
}