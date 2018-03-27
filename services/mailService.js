
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bulletinbible@gmail.com',
        pass: '1987rekhasingh'
    }
});



var mailHelper = {
    Send: function (req, res) {
        var feedback = req.body;
        var mailOptions = {
            from: feedback.email,
            to: 'shekharsingh_1987@yahoo.com',
            subject: feedback.subject,
            text: feedback.message
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                res.json({ "success": true });
            }
        });
    }
}

module.exports = mailHelper;
