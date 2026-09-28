const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendContactNotification = async (contactMessage) => {
    const {
        name,
        email,
        subject,
        message
    } = contactMessage;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        replyTo: email,
        subject: `New Portfolio Contact: ${subject || "No Subject"}`,
        text: `
You received a new message from your portfolio website.

Name: ${name}
Email: ${email}
Subject: ${subject || "No Subject"}

Message:
${message}
        `
    });
};

module.exports = {
    sendContactNotification
};