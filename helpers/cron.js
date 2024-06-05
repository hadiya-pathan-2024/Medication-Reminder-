const cron = require('node-cron');
const db = require('../models/index');
const { Op } = require('sequelize');
const { sendNotification } = require('../controllers/notification.controller');
const { users,medications, one_time_schedule, recurring_schedules, notifications_log } = db;
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
//one-time
async function OneTimeScheduler(){
  cron.schedule('*/10 * * * * *', async () => {
    const now = new Date();
    // console.log("date: ", now.toISOString());
    // console.log("time: ", now.toTimeString().split(' ')[0]);
    const oneTimeSchedules = await one_time_schedule.findAll({
      attributes: ['time'],
      where: {
        // date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        marked_as_done: false
      },
      include: [
        {
          model: medications,
          attributes: ['id','medicine_name','description'],
          include: [
            {
              model: users,
              attributes: ['email']
            }
          ]
        }
      ],
    });
    // console.log("Result: ", oneTimeSchedules);
    oneTimeSchedules.forEach(schedule => {
      sendNotification(schedule.medication);
      console.log(`One-time medication reminder for ${schedule.medication.medicine_name}`);
      notifications_log.create({
        medication_id: schedule.medication.id,
        notification_date: now,
        details: `One-time medication reminder for ${schedule.medication.medicine_name}`,
      });
    });
  });
}
//recurring
 async function RecurringScheduler(){
  cron.schedule('0 * * * *', async () => {
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    console.log("today: ", todayDate);
    const recurringSchedules = await recurring_schedules.findAll({
      attributes: ['frequency','start_date','end_date','day_of_week'],
      where: {
        start_date: {
          [Op.lte]: todayDate,
        },
        end_date: {
          [Op.gte]: todayDate,
        },
      },
      include: [
        {
          model: medications,
          attributes: ['id','medicine_name','description'],
          include: [
            {
              model: users,
              attributes: ['email']
            }
          ]
        }
      ],
    });
    recurringSchedules.forEach(schedule => {
      const shouldNotify = schedule.frequency === 'Daily' ||
        (schedule.frequency === 'Weekly' && schedule.day_of_week === now.toLocaleString('en-IN'));
  
      if (shouldNotify) {
        sendNotification(schedule.medication);
        notifications_log.create({
          medication_id: schedule.medication.id,
          notification_date: now,
          details: `Recurring medication reminder for ${schedule.medication.medicine_name}`,
        });
      }
    });
  });
 }

//weekly report
const reportQueue = require('../services/queue');

async function scheduleReports(req) {
  console.log("req: ", req)
  const Allusers = await users.findAll();
  Allusers.forEach(user => {
    reportQueue.add('generateReport', { userId: user.id });
  });
  // console.log("users: ", Allusers)
}

// Schedule to run every week
async function WeeklyReportScheduler(){
  cron.schedule('* * * * *', scheduleReports)
};

module.exports = {OneTimeScheduler,RecurringScheduler, WeeklyReportScheduler}