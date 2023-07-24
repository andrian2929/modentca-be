const cron = require('node-cron')
const { markAsNotCheckedIn } = require('../controllers/checkinController')

const task = cron.schedule(
  '34 22 * * *',
  async () => {
    await markAsNotCheckedIn()
    console.log('Cron job executed')
  },
  {
    scheduled: false,
    timezone: 'Asia/Jakarta'
  }
)

task.start()
