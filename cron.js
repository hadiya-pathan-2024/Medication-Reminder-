const cron = require('node-cron');
const db = require('./models/index');
const { Op } = require('sequelize');
const { sendNotification } = require('./controllers/notification.controller');
const { users,medications, one_time_schedule, recurring_schedules, notifications_log } = db;
const dotEnv = require("dotenv");
dotEnv.config({ path: `.env` });
//one-time
async function OneTimeScheduler(){
  cron.schedule('* * * * *', async () => {
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
  cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
  
    const recurringSchedules = await recurring_schedules.findAll({
      where: {
        start_date: {
          [Op.lte]: today,
        },
        end_date: {
          [Op.gte]: today,
        },
      },
      include: [medications],
    });
  
    recurringSchedules.forEach(schedule => {
      const shouldNotify = schedule.frequency === 'Daily' ||
        (schedule.frequency === 'Weekly' && schedule.dayOfWeek === now.toLocaleString('en-us', { day_of_week: 'long' }));
  
      if (shouldNotify) {
        sendNotification(schedule.medications);
        notifications_log.create({
          medication_id: schedule.medications.id,
          notification_date: now,
          details: `Recurring medication reminder for ${schedule.medications.medicine_name}`,
        });
      }
    });
  });
 }
  module.exports = {OneTimeScheduler,RecurringScheduler}