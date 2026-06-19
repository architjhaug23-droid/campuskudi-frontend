// js/api.js

const API_URL =
"http://campuskudi.com/api";

function getToken(){

 return localStorage.getItem(
 'token'
 );
}

async function getData(
 endpoint
){

 const response =
 await fetch(
 `${API_URL}${endpoint}`
 );

 return response.json();
}

async function postData(
 endpoint,
 data
){

 const response =
 await fetch(
 `${API_URL}${endpoint}`,
 {
   method:'POST',

   headers:{
      'Content-Type':
      'application/json'
   },

   body:
   JSON.stringify(data)
 });

 return response.json();
}