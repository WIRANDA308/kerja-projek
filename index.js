const express = require("express");
const app = express();
const port = 3000;
const { connectDB, closeDB, client } = require("./db/database");
const bodyParser = require("body-parser");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('img'))
app.use(express.static('style'))
app.use(express.static('views'))
app.set("view engine", "ejs");
connectDB();

app.get("/kerja-projek", async (req,res) => {
    res.render("index")
})


app.get("/admin", async (req,res)=> {
    const db = await  client.db("databasejawir");
    const cl = await db.collection("feedback");
    const data = await cl.find({}).toArray();
    res.render("admin", {data});
})


app.post("/feedback", async (req,res) => { 
    const {user, email, coment,time,number} = req.body;
    const dbajuk = await client.db("databasejawir");
    const feedbackjidan = dbajuk.collection("feedback");
    await feedbackjidan.insertOne({user,email,coment,time,number});
    res.json({user,email,coment,time,number})
})

app.delete("/delete", async(req,res)=> {
    

    const {user}= req.body;
    console.log(user);
    const db = await client.db("databasejawir");
    const cl= await db.collection("feedback");
    const dl = await cl.deleteOne({user});
    console.log(dl.deletedCount);
    res.send(req.body);
})

app.get("/edit/:number", async(req,res) => {
    const param = req.params;
  
    res.render("edit", param)
})


app.post("/edit",async(req,res) => {
    const {number} = req.body;
    const NEW = req.body;
    console.log(NEW,number);
    const db = await client.db("databasejawir");
    const cl= await db.collection("feedback");
    await cl.findOneAndUpdate(
     {number},
     {$set: NEW}, 
     {returnOriginal: false}   
    );
    res.json(NEW);
})

process.on('SIGINT', async () => {
    await closeDB();
    process.exit();
});


app.listen(port,() => {
    console.log("berhasil masuk di port 3000");
})