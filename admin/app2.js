const API_URL = 'https://0k214j9xf6.execute-api.us-east-1.amazonaws.com/production';  
  
var form = document.getElementById("myForm"),  
    imgInput = document.querySelector(".img"),  
    file = document.getElementById("imgInput"),  
    userName = document.getElementById("name"),  
    eid = document.getElementById("eid"),  
    city = document.getElementById("city"),  
    email = document.getElementById("email"),  
    phone = document.getElementById("phone"),  
    post = document.getElementById("post"),  
    sDate = document.getElementById("sDate"),  
    submitBtn = document.querySelector(".submit"),  
    userInfo = document.getElementById("data"),  
    modal = document.getElementById("userForm"),  
    modalTitle = document.querySelector("#userForm .modal-title"),  
    newUserBtn = document.querySelector(".newUser");  
  
  
let getData = [];  
let isEdit = false, editId;  
  
async function makeGetRequest(endpoint) {  
    const response = await fetch(`${API_URL}/${endpoint}`, {  
      method: "GET",  
      headers: {  
        'Content-Type': 'application/json'  
      },  
    });  
    getData = await response.json();  
}  
  
async function makeRequest(endpoint, method, data) {  
    const response = await fetch(`${API_URL}/${endpoint}`, {  
      method: method,  
      headers: {  
        'Content-Type': 'application/json'  
      },  
      body: JSON.stringify(data)  
    });  
    return await response.json();  
}  
  
newUserBtn.addEventListener('click', ()=> {  
    submitBtn.innerText = 'Submit';  
    modalTitle.innerText = "Fill the Form";  
    isEdit = false;  
    imgInput.src = "./image/Profile Icon.webp";  
    form.reset();  
});  
  
file.onchange = function(){  
    if(file.files[0].size < 1000000){    
        var fileReader = new FileReader();  
  
        fileReader.onload = function(e){  
            imgUrl = e.target.result;  
            imgInput.src = imgUrl;  
        };  
  
        fileReader.readAsDataURL(file.files[0]);  
    }  
    else{  
        alert("This file is too large!");  
    }  
};  
  
async function showInfo(){  
    await makeGetRequest("employees");  
    document.querySelectorAll('.employeeDetails').forEach(info => info.remove());  
    getData.employees.forEach((element, index) => {  
        let createElement = `<tr class="employeeDetails">  
            <td>${index+1}</td>  
            <td><img src="${element.picture}" alt="" width="50" height="50"></td>  
            <td>${element.employeeName}</td>  
            <td>${element.employeeid}</td>  
            <td>${element.employeeCity}</td>  
            <td>${element.employeeEmail}</td>  
            <td>${element.employeePhone}</td>  
            <td>${element.employeePost}</td>  
            <td>${element.startDate}</td>  
  
  
            <td>  
                <button class="btn btn-success" onclick="readInfo('${element.picture}', '${element.employeeName}', '${element.employeeid}', '${element.employeeCity}', '${element.employeeEmail}', '${element.employeePhone}', '${element.employeePost}', '${element.startDate}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>  
  
                <button class="btn btn-primary" onclick="editInfo(${index}, '${element.picture}', '${element.employeeName}', '${element.employeeid}', '${element.employeeCity}', '${element.employeeEmail}', '${element.employeePhone}', '${element.employeePost}', '${element.startDate}')" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>  
  
                <button class="btn btn-danger" onclick="deleteInfo(${element.employeeid})"><i class="bi bi-trash"></i></button>              
            </td>  
        </tr>`;  
        userInfo.innerHTML += createElement;  
    });  
}  
showInfo();  
  
function readInfo(pic, name, eid, city, email, phone, post, sDate){  
    document.querySelector('.showImg').src = pic;  
    document.querySelector('#showName').value = name;  
    document.querySelector("#showEid").value = eid;  
    document.querySelector("#showCity").value = city;  
    document.querySelector("#showEmail").value = email;  
    document.querySelector("#showPhone").value = phone;  
    document.querySelector("#showPost").value = post;  
    document.querySelector("#showsDate").value = sDate;  
}  
  
function editInfo(index, pic, name, Eid, City, Email, Phone, Post, Sdate){      
    isEdit = true;      
    editId = index;      
    imgInput.src = pic;      
    userName.value = name;      
    eid.value = Eid;      
    city.value = City;      
    email.value = Email;      
    phone.value = Phone;      
    post.value = Post;      
    sDate.value = Sdate;      
    eid.disabled = true; // Enable editing of employee ID    
      
    submitBtn.innerText = "Update";      
    modalTitle.innerText = "Update The Form";      
}  

  
function deleteInfo(employeeId) {    
    if (confirm("Are you sure you want to delete?")) {    
        const apiUrl = 'https://0k214j9xf6.execute-api.us-east-1.amazonaws.com/production/employee';    
    
        fetch(apiUrl, {    
            method: 'DELETE',    
            headers: {    
                'Content-Type': 'application/json'    
            },    
            body: JSON.stringify({ employeeId: employeeId.toString() })    
        })    
        .then(response => response.json())    
        .then(data => {    
            if (data.Message === 'SUCCESS') {    
                console.log("Record deleted successfully");    
                showInfo();    
            } else {    
                console.error("Error deleting record:", data.Message);    
            }    
        })    
        .catch(error => {    
            console.error("Error deleting record:", error);    
        });    
    }    
}  
  
form.addEventListener('submit', (e)=> {  
    e.preventDefault();  
  
    const information = {  
        picture: imgInput.src == undefined ? "./image/Profile Icon.webp" : imgInput.src,  
        employeeName: userName.value,  
        employeeid: eid.value,  
        employeeCity: city.value,  
        employeeEmail: email.value,  
        employeePhone: phone.value,  
        employeePost: post.value,  
        startDate: sDate.value  
    };  
  
    if(!isEdit){  
        // getData.push(information)  
    }  
    else{  
        isEdit = false;  
        getData[editId] = information;  
    }  
  
    // localStorage.setItem('userProfile', JSON.stringify(getData))  
  
    submitBtn.innerText = "Submit";  
    modalTitle.innerHTML = "Fill The Form";  
  
    showInfo();  
    makeRequest("employee","POST",information);  
    form.reset();  
  
    imgInput.src = "./image/Profile Icon.webp";    
  
    // modal.style.display = "none"  
    // document.querySelector(".modal-backdrop").remove()  
});  
