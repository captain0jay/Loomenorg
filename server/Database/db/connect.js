const mongoose = require('mongoose')

const connectdb  = (uri) =>{
return mongoose.connect(uri,
    { useNewUrlParser: true, 
      useUnifiedTopology: true }).then(() => console.log('MongoDB Atlas Connected')).catch(err => console.log(err));
    }

module.exports  = connectdb