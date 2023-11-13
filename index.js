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

// var toDo = [];
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
app.use(tasks())
async function tasks (){
    const result = await db.query("SELECT todo_task From today")
    var toDo = [];
    result.rows.forEach((tarea)=>{
        toDo.push(tarea.todo_task);
    });
    return toDo;
}

app.get("/", async (req, res) =>{
    var numberOfTask = toDo.length;
    var datos = await tasks();
    var Data = {
        todo: toDo,
        days: today,
        ntasks: numberOfTask
    };
    res.render(__dirname+"/views/index.ejs", Data)
})

app.post("/submit", async (req,res)=>{
    var newTask={
        task: req.body["task"],
    }
    var tarea = req.body["task"];
    await db.query("INSERT INTO today (todo_task) VALUES ($1)",[tarea])
    toDo.push(newTask)
    
    
    var numberOfTask = toDo.length;
    var Data = {
        todo: toDo,
        task: newTask,
        days: today,
        ntasks: numberOfTask
    };
    res.render(__dirname+"/views/index.ejs", Data) 
})


app.get("/my-day", (req,res)=>{
    var numberOfTask = workToDo.length;
    var Data = {
        work: workToDo,
        wtasks: numberOfTask
    };
    res.render(__dirname+"/views/work.ejs", Data)
})
app.post("/worktodo",async (req,res)=>{
    var newTask=req.body["task_checkbox"]
    workToDo.push(newTask)
    var numberOfTask = workToDo.length;
    var Data = {
        work: workToDo ,
        new_task: newTask,
        wtasks: numberOfTask
    };
    var tarea = req.body["task_checkbox"];
    await db.query("INSERT INTO work_to_do (todo_task) VALUES ($1)",[tarea])
    res.render(__dirname+"/views/work.ejs", Data) 
})

// app.delete("/" ,(req, res)=>{
//     var delete_task = req.body["checkbox"].id 
// })

app.listen(port, ()=>{
    console.log(`listening  http://localhost:${port}`)
})
