const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const app = express()
const port = 8000;
const url = 'mongodb://localhost/register';
mongoose.connect(url);


const con = mongoose.connection;
con.on('open' , function(){
    console.log("connected...")
})

app.use(express.json());
app.use(cors());

const registerRouter = require('./RegisterRoutes/Registerroute')
app.use('/', registerRouter)

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})