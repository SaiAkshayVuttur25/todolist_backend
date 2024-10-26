import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "To-Do-List",
  password: "*******",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items=[
    {task:"to eat bf" , id : 1},
    {task:"to heat water" , id : 2}
];

app.get("/" ,async(req,res)=>{
    try {
        const result = await db.query("SELECT * FROM list ORDER BY id ASC");
        items = result.rows;
        res.render("index.ejs",{
            Title : "Today",
            listItems : items,
        });
    }
    catch(err){
        console.log(err);
    }
});
app.post("/add",async(req,res)=>{
    const item = req.body.newItem;
    try {
        await db.query("INSERT INTO list (task) VALUES ($1)", [item]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
    }
});
app.post("/edit",async(req,res)=>{
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE list SET task = ($1) WHERE id = $2", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/delete",async(req,res)=>{
    const id = req.body.deleteItemId;
    try {
        await db.query("DELETE FROM list WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});