const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
if (!fs.existsSync('./public/uploads')) fs.mkdirSync('./public/uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });
const DATA_FILE = "./data.json";
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({users:[], posts:[]}, null,2));
app.post("/create-user", upload.single("avatar"), (req, res) => {
  const { username } = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  if(data.users.find(u => u.username.toLowerCase()===username.toLowerCase())) return res.json({success:false});
  const avatar = req.file ? "/uploads/" + req.file.filename : null;
  data.users.push({ username, avatar });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
  res.json({success:true, username, avatar});
});
app.post("/create-post", (req,res)=>{
  const { username, text } = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const user = data.users.find(u => u.username===username);
  if(!user) return res.json({success:false});
  data.posts.unshift({ username, avatar:user.avatar, text });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data,null,2));
  res.json({success:true});
});
app.get("/posts", (req,res)=>{
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data.posts);
});
app.listen(3000);
