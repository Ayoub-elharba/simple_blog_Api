import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const API_URL = "http://localhost:4000";
const app=express();
const port =3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));


app.get("/", async(req,res)=>{
    try{
    const result = await axios.get(`${API_URL}/posts`);
    console.log(result)
    res.render("index.ejs",{posts:result.data})
    }catch(err){
    console.log(err)
}
});
app.get("/new",(req,res)=>{
    res.render("modify.ejs",{submit:'create',heading:"create New post"});
});

app.post("/posts",async(req,res)=>{
    try {
        const response = await axios.post(`${API_URL}/posts`, req.body);
        console.log(response.data);
        res.redirect("/");
      } catch (error) {
        res.status(500).json({ message: "Error creating post" });
      }
    });

app.get("/edit/:id",async(req,res)=>{
    try{
        const response=await axios.get(`${API_URL}/posts/${req.params.id}`);
        res.render("modify.ejs",{post:response.data,submit:'UPDATE',heading:"Update Post"})
    }catch(err){
        res.status(500).json({ message: "Error edit post" })
    }
});

app.post("/posts/:id",async(req,res)=>{
    try{
    const response=await axios.patch(`${API_URL}/posts/${req.params.id}`,req.body);
    console.log(response.data);
    res.redirect("/");
  }catch (error) {
    res.status(500).json({ message: "Error updating post" });
  }
});
app.get("/delete/:id",async(req,res)=>{
    try{
        const response=await axios.delete(`${API_URL}/posts/${req.params.id}`);
        console.log(response.data);
        res.redirect("/");
      }catch (error) {
        res.status(500).json({ message: "Error updating post" });
      }
})
app.listen(port,()=>{
    console.log("SERVER RUN AT ",port);
});