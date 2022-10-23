const express = require("express");
const request = require("request");
const https = require("https");
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public")); //our image and css file is considered as static, so we have created a folder named public and saved images and css folder containing our files inside it.

app.get("/", function(req, res)
{
res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res)
{
  //app.use(express.urlencoded({extended: true}));
  //app.use(express.json());
const firstName = req.body.fName;
const lastName = req.body.lName;
const emailaddress = req.body.email;
//below is our javascript object 'data' which holds thekey-value pairs that the mailchimp API is going to recognise
const data = {
  //an array of objects - members
  members:[
    {
      email_address: emailaddress,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }
  ]
}
//we need to turn this object to json
const jsonData = JSON.stringify(data);
const url = "https://us21.api.mailchimp.com/3.0/lists/d32382abf9";
//js object
const options = {
    method:"POST",
    auth: "Shreya:bf3e87bfd02c2936c36a2943268dfe27-us21"
}
//creating a request
const request = https.request(url, options, function(response){
  if(response.statusCode === 200)
  {
    res.sendFile(__dirname + "/success.html");
  }
  else {
    res.sendFile(__dirname + "/failure.html");
  }
  response.on("data", function(data)
{
  console.log(JSON.parse(data));
})
})
request.write(jsonData); // pasing jsonData to mailchimp server
request.end();
});

//another request for failure route that redirects the user to home route

app.post("/failure", function(req, res){
res.redirect("/")
});
app.listen(process.env.PORT|| 3000, function(req, res)
{
  console.log("server is running!");
});

// api key 1daeca03986ded517580a98bd3e09399-us21
//audience/list id d32382abf9 - helps mailchimp identify the list that you want to put your subscribers into
