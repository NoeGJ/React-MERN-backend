const mongoose = require('mongoose');

const dbConn = async() => {
    try {
        await mongoose.connect( process.env.DB_CNN );

        console.log('DB Online');

    } catch(error){
        console.log(error);
        throw new Error('Error a la hora de inicializar la DB');
    }
}

module.exports = {
    dbConn
}

