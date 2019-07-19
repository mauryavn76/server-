const express = require('express')
const router = express.Router()
const {Client,Query} = require('pg')
const path = require('path')
var config=require('../../config.json')


const connectionString = "postgres://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+":"+config.postgres.port+"/"+config.postgres.database
const client = new Client({
  connectionString:connectionString
})
 router.post('/post/student',(req,res,next) =>{
     const results = [];
     const data = {id:req.body.id,fname:req.body.fname,lname:req.body.lname,email:req.body.email,number:req.body.number};
     client.connect((err,client) =>{
         if(err){
            
             console.log(err);
            return res.status(500).json({success:false,data:err})
         }
         client.query("insert into student(id,fname,lname,email,number) values($1,$2,$3,$4,$5)",[data.id,data.fname,data.lname,data.email,data.number]);
         const query=client.query(new Query('select * from student'));
         query.on(row =>{
             results.push(row);
         });
         query.on(() => {
          
             return res.json(results);
         })
        
     })
 })

router.get('/get/student', (req, res, next) => {
  const results = [];
 
  client.connect((err, client) => {
    if(err) {
  
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    const query = client.query(new Query('SELECT * FROM student'));
   
    query.on('row', (row) => {
      results.push(row);
    });
    query.on('end', () => {
  
      return res.json(results);
    });
  });
});

  

   router.get('/', (req, res, next) => {
     res.sendFile(path.join(
        __dirname, '..', 'public','index.html'));
    });

  module.exports = router;