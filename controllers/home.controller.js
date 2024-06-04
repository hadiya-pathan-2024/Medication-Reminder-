const db = require('../models/index');
const { sessions,users,medications, one_time_schedule,recurring_schedules  } = db;

async function home(req, res) {
  const sessionData = await sessions.findOne({
    attributes: ['token_id'],
    where: {
      token_id: req.token
    }
  })
  // console.log(sessionData)
    res.render("pages/home")
}

async function newMedication(req, res){
    const { name, description,type, frequency, date, time, startDate, endDate, dayOfWeek } = req.body;
    // console.log("body: ", req.body);
    const medication = await medications.create({ user_id:req.user.id, medicine_name: name, description });
    if (type === 'one-time') {
      await one_time_schedule.create({ medication_id: medication.id, date, time: time[0] });
    } else {
      await recurring_schedules.create({ medication_id: medication.id, frequency, start_date: startDate, end_date: endDate, time: time[1], day_of_week:dayOfWeek });
    }
    res.redirect('/home');
  };

module.exports = { home, newMedication }