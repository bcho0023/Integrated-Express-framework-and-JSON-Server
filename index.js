const express = require('express');
const jsonServer = require('json-server')
const axios = require('axios');
const app = express()
const PORT = 3000;

app.use('/api', jsonServer.defaults(), jsonServer.router('db.json')); 
app.use(express.json())

app.listen(PORT, () => {
    console.log('Node app is running on port ' + PORT)
})

app.get('/sites', (req, res) => {
    fetchJsonServer(req.path + '?_embed=bookings', req, res)
  });

app.get('/bookings', (req, res) => {

    if (req.query.siteId){
        fetchJsonServer(req.path+'?_embed=tests', req, res)
    }
    else{
        fetchJsonServer(req.path, req, res)
    }
  });

app.get('/bookings/:id', (req, res) => {
    fetchJsonServer(req.path + '?_embed=tests', req, res)
  });

app.get('*', (req,res) => {
  fetchJsonServer(req.path, req, res)
})

app.post('/bookings', (req,res) =>{
  const pin = generatePIN()
  const now = new Date().toISOString()
  const reqJson = req.body
  const jsonData = {
    "customerId": reqJson.customerId,
    "siteId": reqJson.siteId,
    "smsPin": pin,
    "status": "INITIATED",
    "notes": "tester",
    "additionalInfo": {
      "qrCode": reqJson.additionalInfo.qrCode ? reqJson.additionalInfo.qrCode : "",
      "conferenceUrl":  reqJson.additionalInfo.conferenceUrl ? reqJson.additionalInfo.conferenceUrl : "",
      "symptoms": [],
      "modifications": []
    },
    "startTime": reqJson.startTime,
    "createdAt": now,
    "updatedAt": now,
  }

  postJsonServer(req.path, jsonData, res)
  res.status(200).send({ "smsPin": pin})
})

app.post('/tests', (req,res) => {
  postJsonServer(req.path, req.body, res)
})

app.patch('/bookings/:id', (req,res) => {
  patchJsonServer(req.path, req.body, res)
  res.status(200).send()
  
})

async function fetchJsonServer(urlTail, req, res){
  try {
      // URL from which you want to fetch data
      const url = 'http://localhost:3000/api' + urlTail;
  
      // Make GET request to the external URL
      const response = await axios.get(url);
  
      // Send the response data back to the client
      res.json(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).send('An error occurred while fetching data');
    }
}

async function postJsonServer(urlTail, object, res){
  try {
      // URL from which you want to fetch data
      const url = 'http://localhost:3000/api' + urlTail;
  
      // Make GET request to the external URL
      const response = await axios.post(url, object)
  
      // Send the response data back to the client
      console.log("Sucessful POST")
    } catch (error) {
      console.error('Error posting data:', error);
      res.status(500).send('An error occurred while posting data');
    }
}

async function patchJsonServer(urlTail, object, res){
  try {
      // URL from which you want to fetch data
      const url = 'http://localhost:3000/api' + urlTail;
  
      // Make GET request to the external URL
      const response = await axios.patch(url, object)
  
      // Send the response data back to the client
      console.log("Sucessful PATCH")
    } catch (error) {
      console.error('Error patching data:', error);
      res.status(500).send('An error occurred while patching data');
    }
}

function generatePIN() {
  // Generate a random number between 0 and 9999
  let pin = Math.floor(Math.random() * 10000);

  // Ensure the PIN is exactly 4 digits long
  pin = String(pin).padStart(4, '0');

  return pin;
}
  


// app.get('/sites', (req,res) => {
//     res.status(200).send({
//         'test':"tester"
//     })
// });