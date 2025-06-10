express = require("express")
path = require("path")
const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
methodOverride = require('method-override')
const { v4: uuidv4 } = require('uuid');

app = express()
port = 4000
app.listen(port, ()=>{
    console.log("We are on at ", port)
})

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
 
});


// ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'


app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))

app.get("/", (req, res)=>{
  let q = "select count(*) from user";
  try{
    connection.query(q, (err, result)=>{
      if(err)
        throw err;
      else
      console.log(result[0]['count(*)'])
      count = result[0]['count(*)'];
      res.send(`Total Users:  ${count}`)
    })
  }
  catch(err)
  {
    console.log(err)
    res.send("Some error occured in db")
  }
})
//show all users
app.get("/users", (req, res)=>{
  let q = "select * from user";
  try{
    connection.query(q, (err, result)=>{
      if(err)
        throw err;
      else
      console.log(result)
    
      res.render("users.ejs", {users: result})
    })
  }
  catch(err)
  {
    console.log(err)
    res.send("Some error occured in db")
  }
})

//edit route
app.get("/edit/:id", (req, res)=>{
  let { id } = req.params;
  console.log(id)
  let q = `select * from user where id = '${id}'`;
  try{
    connection.query(q, (err, result)=>{
      if(err)
        throw err;
      else{
        console.log(result)
        res.render("edit.ejs", {user: result[0]})
      }
    
      // res.render("users.ejs", {users: result})
    })
  }
  catch(err)
  {
    console.log(err)
    res.send("Some error occured in db")
  }
  
})

//Update route (PATCh)
app.patch("/edit/:id", (req, res)=>{
  let { femail, fpassword } = req.body;
  let {id} = req.params;
  console.log(id)
  let q = `select * from user where id = '${id}'`;
  try{
    connection.query(q, (err, result)=>{
      if(err)
        throw err;
      else{
        user = result[0];
        console.log("user : ", user)
        console.log(user.password)
        console.log(fpassword)
        if(user.password === fpassword)
        {
          console.log(id)
          console.log("success")
         q2 = `update user set email = "${femail}" where id = "${id}"`;
          try{
            connection.query(q2, (err, result)=>{
              if(err)
                throw err;
              else{
                console.log(result)
                res.redirect("/users")
              }
            
              // res.render("users.ejs", {users: result})
            })

          }
          catch(err)
          {
            console.log(err)
            res.send("Some error occured in db")
          }
        }
        else{
          console.log("they are not same")
          res.send("your Password is wrong ")
        }
      }
    
      // res.render("users.ejs", {users: result})
    })
  }
  catch(err)
  {
    console.log(err)
    res.send("Some error occured in db")
  }
})

//New User
app.get("/newuser", (req, res)=>{
  res.render("newuser.ejs");
})

//Uploading user details - Post
app.post("/newuser", (req, res)=>{
  let {username, password, email} = req.body;
  let id = uuidv4();
  let q = `insert into user (id, username, email, password) values ('${id}', '${username}', '${email}', '${password}')`
  try{
  connection.query(q, (err, result)=>{
    if(err)
      throw err;
    else
    console.log(result)
  res.redirect("/users")
  })
}
catch(err)
{
  res.send("Some Error Occured please try again later")
  console.log(err)
}
})
app.delete("/delete/:id", (req, res)=>{
    let {id} = req.params;
    let q = `delete from user where id = "${id}"`;

    try{
      connection.query(q, (err, result)=>{
        if(err)
          throw err;
        else
        console.log(result)
      
        res.redirect("/users")
      })

    }
    catch(err)
    {
      console.log(err)
      res.send("Some error occured in db")
    }
})