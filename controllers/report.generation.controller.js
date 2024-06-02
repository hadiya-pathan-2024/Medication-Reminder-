const db = require('../models/index');
const { users, medications } = db;
const nodemailer = require('nodemailer');
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const path = require('path');
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });

async function generateAndSendReport(userId) {
    const user = await users.findByPk(userId);
    if (!user) throw new Error('User not found');

    const logs = await medications.findAll({
        where: {
            userId,
            date: { [sequelize.Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) }
        }
    });

    const csvWriter = createObjectCsvWriter({
        path: path.resolve(__dirname, `reports/${userId}.csv`),
        header: [
            { id: 'medicineName', title: 'Medicine Name' },
            { id: 'markAsDone', title: 'Mark as Done' },
            { id: 'time', title: 'Time' },
            { id: 'date', title: 'Date' },
        ]
    });

    const records = logs.map(log => ({
        medicine_name: log.medicine_name,
        // markAsDone: log.markAsDone,
        // time: log.time,
        // date: log.date
    }));

    await csvWriter.writeRecords(records);

    await sendEmail(user.email, path.resolve(__dirname, `reports/${userId}.csv`));
}

async function sendEmail(to, attachmentPath) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Your Weekly Medicine Report',
        text: 'Please find attached your weekly medicine report.',
        attachments: [
            {
                filename: 'report.csv',
                path: attachmentPath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
}

module.exports = { generateAndSendReport };
