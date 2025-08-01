const morgan = require('morgan');
const winston = require('winston');


const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'logs/access.log' })
  ]
});

// const wtriteStream = fs.createWriteStream(path.join(__dirname, 'logs.txt'), {flags:'a'}, {encoding: 'utf-8'});

const logs = ()=>{
    
    return morgan('combined', {
      stream: {
        write: (message) => logger.info(message.trim())
      }
    })
}

module.exports = logs