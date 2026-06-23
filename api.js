// js/api.js

const API_URL = "http://api.campuskudi.com/api";

function getToken() {
    return localStorage.getItem("token");
}

// GET REQUEST
async function getData(endpoint) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            headers: {
                Authorization: getToken()
                    ? `Bearer ${getToken()}`
                    : ""
            }
        }
    );

    return response.json();
}

// POST REQUEST
async function postData(endpoint, data) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: getToken()
                    ? `Bearer ${getToken()}`
                    : ""
            },

            body: JSON.stringify(data)
        }
    );

    return response.json();
}

// PUT REQUEST
async function putData(endpoint, data) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`
            },

            body: JSON.stringify(data)
        }
    );

    return response.json();
}

// DELETE REQUEST
async function deleteData(endpoint) {

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
    );

    return response.json();
}
