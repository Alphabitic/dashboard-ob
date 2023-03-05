module.exports = {
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.OUTLOOK_USERNAME,
        pass: process.env.OUTLOOK_PASSWORD
    },
    tls: {
        ciphers: "SSLv3"
    }
};

