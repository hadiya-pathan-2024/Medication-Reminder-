const db = require('../models/index');
const { users, medications, one_time_schedule } = db;
const nodemailer = require('nodemailer');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');
const dotEnv = require("dotenv");
const { Op } = require('sequelize');
dotEnv.config({ path: `.env` });

async function generateAndSendReport(userId) {
    const user = await users.findOne({
        attributes: ['email'],
        where: {
            id: userId
        }
    });
    if (!user) throw new Error('User not found');

    const logs = await medications.findAll({
        attributes: ['user_id', 'medicine_name'],
        where: {
            user_id: userId,
            // date: { [Op.gte]: new Date(new Date().setDate(new Date().getDate() - 7)) }
        },
        include: [
            {
                model: one_time_schedule,
                attributes: ['date', 'time','marked_as_done'],
            }
        ]
    });
    // console.log("Logs: ", logs[0].one_time_schedules[0].time);
    // console.log("Logs: ", logs);
    const csvWriter = createObjectCsvWriter({
        // path: path.resolve(__dirname + `reports/${userId}.csv`),
        path: ('/home/hadiya-pathan/Downloads/1.csv'),
        header: [
            { id: 'medicineName', title: 'Medicine Name' },
            { id: 'markAsDone', title: 'Mark as Done' },
            { id: 'time', title: 'Time' },
            { id: 'date', title: 'Date' },
        ]
    });
    const records = logs.map(log => {
    return {
        medicineName: log.medicine_name,
        markAsDone: log.one_time_schedules[0]?.marked_as_done ?? "",
        time: log.one_time_schedules[0]?.time,
        date: log.one_time_schedules[0]?.date
    }
});
    // console.log("csv: ", records);
    await csvWriter.writeRecords(records);

    // await sendEmail(user.email, '/home/hadiya-pathan/Downloads/1.csv');
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
