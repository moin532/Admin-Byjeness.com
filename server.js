const  app = require('./app');

const dotenv = require('dotenv');


//config
dotenv.config({path:"config.env"})


app.listen(process.env.PORT,()=>{
    console.log(`listening port on http://localhost:${process.env.PORT}`)
})