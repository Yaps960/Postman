import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.locals.posts = [];

// Landing page (name input)
app.get("/", (req, res) => {
  res.render("./name.ejs");
});

// Handle name submission
app.post("/", (req, res) => {
  const name = req.body.name;
  res.redirect(`/home?name=${name}`);
});

// Home page (where the posts are shown)
app.get("/home", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.redirect("/");
  }
  res.render("./index.ejs", {
     name: name,
     req: req
    });
});

app.get("/create", (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.redirect("/");
  }
  res.render("./create.ejs", { name: name });
});

app.post("/create", (req, res) => {
  const name = req.body.name;
  if (!name) {
    return res.redirect("/");
  }
  const title = req.body.title;
  const content = req.body.content;
  
  // Add the new post
  req.app.locals.posts.push({
    id: Date.now().toString(),
    title,
    content,
    author: name,
    createdAt: new Date()
  });
  
  res.redirect(`/home?name=${name}`);
});

// Render edit form
app.get("/edit/:id", (req, res) => {
  const { id } = req.params;
  const name = req.query.name;
  const post = req.app.locals.posts.find(p => p.id === id);
  if (!post) return res.redirect(`/home?name=${name}`);
  res.render("edit.ejs", { name, post });
});

// Handle post edit (simulate PUT with POST)
app.post("/edit/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const post = req.app.locals.posts.find(p => p.id === id);
  if (post) {
    post.title = title;
    post.content = content;
  }
  res.redirect(`/home?name=${req.query.name}`);
});

// Handle delete
app.post("/delete/:id", (req, res) => {
  const { id } = req.params;
  req.app.locals.posts = req.app.locals.posts.filter(p => p.id !== id);
  res.redirect(`/home?name=${req.query.name}`);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});