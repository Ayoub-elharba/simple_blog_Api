import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BlogServer",
    password: "Bilk",
    port: 5432,
  });
db.connect();

const port =4000;
const app=express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

async function getALLdata(){
    const res= db.query("SELECT * FROM blog ORDER BY id ASC");
    return res;
}

app.get("/posts",async(req,res)=>{
    try{
        const dts=await getALLdata();
        console.log((dts.rows));
        res.send(dts.rows);
        console.log(Date("MM/dd/yyyy h:mm a"))
    }catch(err){
        console.log(err);
    }
});

app.post("/posts",async(req,res)=>{
    const title=req.body.title;
    const content=req.body.content;
    const author=req.body.author;
    const date=new Date();

    try{
        const dts=await db.query("INSERT INTO blog (title,contents,author,date) VALUES ($1,$2,$3,$4)",[title,content,author,date]);
        res.send(dts.rows)
    }catch(err){
        console.log(err);
    }
});

app.get("/posts/:id",async(req,res)=>{
    const posts=await getALLdata()
    const post=posts.rows.find((e)=>e.id===parseInt(req.params.id));
    if(!post) return res.status(404).json({message:"Post not found"});
    res.json(post);
});

async function updatePost(t,c,a,d,id){
//    const rees= await db.query("UPDATE blog SET title=$1  WHERE id=$2",[t,id]);
//    const ree= await db.query("UPDATE blog SET contents=$1  WHERE id=$2",[c,id]);
//    const re=  await db.query("UPDATE blog SET author=$1  WHERE id=$2",[a,id]);
//    const r= await db.query("UPDATE blog SET date=$1  WHERE id=$2",[d,id]);
//     return rees,ree,re,r
const rees= await db.query("UPDATE blog SET title=$1 ,contents=$2,author=$3,date=$4 WHERE id=$5",[t,c,a,d,id]);
return rees;

}

app.patch("/posts/:id",async(req,res)=>{
    const id= parseInt(req.params.id);
    const title=req.body.title;
    const content=req.body.content;
    const author=req.body.author;
    const date=new Date();

    try{
        const dts=await updatePost(title,content,author,date,id);
        res.send(dts.rows)
    }catch(err){
        console.log(err);
    }
});

app.delete("/posts/:id",async(req,res)=>{
    try{
        const dts=await db.query("DELETE FROM blog WHERE id=$1",[parseInt(req.params.id)]);
        res.send(dts);
    }catch(err){
        console.log(err)
    }
})
app.listen(port,()=>{
    console.log("SERVER RUN AT ",port);
});
