import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app= express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "todo",
    password: "123",
    port: 5432,
  });
  db.connect();

  var local_toDo = [];
var workToDo = [];


var day= new Date().getDay() ;
var month= new Date().getMonth();
var date = new Date().getDate() 
const days= [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday" ,"Saturday", "Sunday"
];
const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
var today = days[day-1] + ", "+date+" "+months[month];
// AREGLA EL DÍA Y LA FECHA

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))

async function tasks (){
    const result = await db.query("SELECT todo_task From today")
    var toDo = [];
    result.rows.forEach((tarea)=>{
        toDo.push(tarea.todo_task);
    });
    local_toDo= toDo;
    return toDo;
}

app.get("/", async (req, res) =>{
    var datos = await tasks();
    var numberOfTask = datos.length;
    var Data = {
        todo: datos,
        days: today,
        ntasks: numberOfTask
    };
    res.render(__dirname+"/views/index.ejs", Data)
})

app.post("/submit", async (req,res)=>{
    var datos = await tasks();
    var tarea = req.body["task"];
    await db.query("INSERT INTO today (todo_task) VALUES ($1)",[tarea])

    var numberOfTask = datos.length;
    var Data = {
        todo: datos,
        task: tarea,
        days: today,
        ntasks: numberOfTask
    };
    res.render(__dirname+"/views/index.ejs", Data) 
})

async function myday (){
    const result = await db.query("SELECT todo_task From work_to_do")
    var work_to_do = [];
    result.rows.forEach((tarea)=>{
        work_to_do.push(tarea.todo_task);
    });
    workToDo= work_to_do;
    return work_to_do;
}

app.get("/my-day", async (req,res)=>{
    var numberOfTask = workToDo.length;
    var wtd = await myday();
    var Data = {
        work: wtd,
        wtasks: numberOfTask
    };
    res.render(__dirname+"/views/work.ejs", Data)
})
app.post("/worktodo",async (req,res)=>{
    var tarea = req.body["work_task"];
    var wtd = await myday();
    var numberOfTask = wtd.length;
    var Data = {
        work: wtd ,
        new_task: tarea,
        wtasks: numberOfTask
    };
    await db.query("INSERT INTO work_to_do (todo_task) VALUES ($1)",[tarea])
    
    res.render(__dirname+"/views/work.ejs", Data) 
})

// app.delete("/submit" , async (req, res)=>{
//     var delete_task = req.body["task"]
//     await db.query("DELETE FROM today WHERE todo_task = $1", [delete_task])
//     res.render(__dirname+"/views/index.ejs")

// })

app.listen(port, ()=>{
    console.log(`listening  http://localhost:${port}`)
})
