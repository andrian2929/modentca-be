const cron = require('node-cron')
const { markAsNotCheckedIn } = require('../controllers/checkinController')

const task = cron.schedule(
  '30 23 * * *',
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
