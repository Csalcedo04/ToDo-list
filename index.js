import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url));
const app= express();
const port = 3000;
var toDo = [];
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

app.get("/", (req, res) =>{
    var numberOfTask = toDo.length;
    var Data = {
        todo: toDo,
        days: today,
        ntasks: numberOfTask
    };
    res.render(__dirname+"/views/index.ejs", Data)
})

app.post("/submit", (req,res)=>{
    var newTask=req.body["task"]
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
app.post("/worktodo", (req,res)=>{
    var newTask=req.body["work_task"]
    workToDo.push(newTask)
    var numberOfTask = workToDo.length;
    var Data = {
        work: workToDo ,
        new_task: newTask,
        wtasks: numberOfTask
    };
    
    res.render(__dirname+"/views/work.ejs", Data) 
})


app.listen(port, ()=>{
    console.log(`listening ${port}`)
})
