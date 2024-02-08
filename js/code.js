const urlBase = 'http://cop4331c-group27.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let userName = "";
let firstName = "";
let lastName = "";
let phoneNumber = "";
let emailAddress = "";


function validatePhoneNumber(phone) {
    // Check if phone number has exactly 10 digits
    return /^\d{10}$/.test(phone);
}


function validatePassword(password) {
    // Check if password has at least 6 characters and at least one number
    return /^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/.test(password);
}


function validateEmail(emailAddress) {
    return /^([a-zA-Z0-9._-]+)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailAddress);
}


function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("login").value;
	let password = document.getElementById("loginpassword").value;
	//var hash = md5( password );
	
	let tmp = {login:login,password:password};
	//var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("error-message").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

                console.log(userId);

				saveCookie();
	
				doHome();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("error-message").innerHTML = err.message;
	}

}


function doRegister() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let login = document.getElementById("username").value;
    let password = document.getElementById("registerpassword").value;
    let verify = document.getElementById("verifyPassword").value;

    if (!validatePassword(password)) {
        alert("Invalid password. Password must have a minimum of 6 characters and 1 digit");
        return;
    }

    if (password != verify) {
		alert("Passwords do not match");
        return;
    }

    if (firstName == "" || lastName == "" || login == "" || password == "" || verify == "" ) {
        alert("Missing Field(s)");
        return;
    }

    let currentDate = new Date();
    let dateCreated = currentDate.toISOString(); // Convert to ISO format

    let tmp = {
        firstName,
        lastName,
        login,
        password,
        dateCreated  // Add this line for the date created
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Register.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) {
                    alert("User already exists");
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                location.reload();
                alert("Successfully added user!");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Registration failed: " + err.message);
    }
}


function doAddContact() {
    readCookieAdd();
    console.log(userId);
    let addFirstName = document.getElementById("addFirstName").value;
    let addLastName = document.getElementById("addLastName").value;
    let addPhoneNumber = document.getElementById("addPhoneNumber").value;
    let addEmailAddress = document.getElementById("addEmailAddress").value;

    if (addFirstName === "" || addLastName === "" || addPhoneNumber === "" || addEmailAddress === "") {
        alert("Missing Field(s)");
        return;
    }

    if (!validatePhoneNumber(addPhoneNumber)) {
        alert("Invalid phone number (must have 10 digits)");
        return;
    }

    if (!validateEmail(addEmailAddress)) {
        alert("Invalid email. Please input a valid email address.");
        return;
    }

    // You can add more validation checks if needed

    let addData = {
        userId: userId,
        firstName: addFirstName,
        lastName: addLastName,
        phoneNumber: addPhoneNumber,
        emailAddress: addEmailAddress,
    };

    let jsonPayload = JSON.stringify(addData);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let addResult;
                try {
                    addResult = JSON.parse(xhr.responseText);
                } catch (e) {
                    console.error("Error parsing JSON response:", e);
                    alert("Failed to add contact. Please try again.");
                    return;
                }
        
                if (addResult.success) {
                    alert("Contact added successfully!");
                   
                } else if (addResult.error) {
                    alert("Failed to add contact: " + addResult.error);
                } else {
                    alert("Failed to add contact. Please try again.");
                }
            }
        };

        xhr.send(jsonPayload);
        doHome();
    } catch (err) {
        console.error("Add contact failed: " + err.message);
    }
}


function doUpdateContactInfo(contactId) {
    readCookieAdd();
    
    let updateFirstName = document.getElementById("updateFirstName").value;
    let updateLastName = document.getElementById("updateLastName").value;
	let updatePhone = document.getElementById("updatePhone").value;
    let updateEmail = document.getElementById("updateEmail").value;

    if (updateFirstName == "" || updateLastName == "" || updatePhone == "" || updateEmail == "") {
        alert("Empty Field(s)");
        return;
    }

    if (!validatePhoneNumber(updatePhone)) {
        alert("Invalid phone number (must have 10 digits)");
        return;
    }

    if (!validateEmail(updateEmail)) {
        alert("Invalid email. Please input a valid email address.");
        return;
    }

    let updateData = {
        firstName: updateFirstName,
        lastName: updateLastName,
        email: updateEmail,
		phone: updatePhone,
        id: contactId
    };

    let jsonPayload = JSON.stringify(updateData);

    let url = urlBase + '/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let updateResult = JSON.parse(xhr.responseText);

                if (updateResult.success) {
                    alert("Contact information updated successfully!");
                    doHome();
                }
            }
        };

        xhr.send(jsonPayload);
        doHome();
    } catch (err) {
        console.error("Update failed: " + err.message);
    }
}


function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ",userName=" + userName + ",phoneNumber=" + phoneNumber + ",emailAddress=" + emailAddress + ";expires=" + date.toGMTString();
}


function readCookie() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (let i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }

    else {
        document.getElementById("welcome").innerHTML = "Welcome, " + firstName + " " + lastName + "!";
    }
}

function readCookieAdd() {
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (let i = 0; i < splits.length; i++) {

        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");

        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        }
        else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        }
        else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    }
}


function doLogout()
{
	userId = 0;
	userName = "";
	firstName = "";
	lastName = "";
	phoneNumber = "";
	emailAddress = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function doAdd()
{
	window.location.href = "add.html";
}


function doHome()
{
    loadContacts();
	window.location.href = "homepage.html";
}



function doSearchContacts() {
    let search = document.getElementById("searchInput").value;
    
    if (!search) {
        alert("Please enter a search query.");
        return;
    }

    // Example API endpoint for searching contacts
    let url = urlBase + '/SearchContact.' + extension;

    let tmp = {
        search: search,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error) {
                        console.log(jsonObject.error);
                        return;
                    }
                    let text = "<table border='1'>"
                    for (let i = 0; i < jsonObject.results.length; i++) {
                        text += "<tr id='row-" + i + "'>";
                        text += "<td id='first-name-" + i + "'><span>" + jsonObject.results[i].firstName + "</span></td>";
                        text += "<td id='last-name-" + i + "'><span>" + jsonObject.results[i].lastName + "</span></td>";
                        text += "<td id='email-" + i + "'><span>" + jsonObject.results[i].email + "</span></td>";
                        text += "<td id='phone-" + i + "'><span>" + jsonObject.results[i].phone + "</span></td>";
                        text += "<td><button onclick='doDeleteContact(" + jsonObject.results[i].id + ")'>Delete</button></td>";
                        text += "<td><button onclick=' doUpdateContactInfo(" + jsonObject.results[i].id + ")'>Edit</button></td>";
                        text += "<tr/>"
                    }
                    text += "</table>"
                    document.getElementById("table-body").innerHTML = text;
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Search failed: " + err.message);
    }
}


    // Add this function to handle contact deletion
function doDeleteContact(contactId) {

    let deleteData = {
        contactId: contactId,
        userId: userId
    };

    let jsonPayload = JSON.stringify(deleteData);

    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let deleteResult = JSON.parse(xhr.responseText);

                if (deleteResult.success) {
                    alert("Contact deleted successfully!");
                    loadContacts(); // Reload the contacts after deletion

                }
            }
        };

        xhr.send(jsonPayload);
        doHome();
    } catch (err) {
        console.error("Delete contact failed: " + err.message);
    }
}


function loadContacts() {
    let tmp = {
        search: "",
        userId: userId
    };

    readCookieAdd();

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) {
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='1'>"
                for (let i = 0; i < jsonObject.results.length; i++) {
                    text += "<tr id='row-" + i + "'>";
                    text += "<td id='first-name-" + i + "'><span>" + jsonObject.results[i].firstName + "</span></td>";
                    text += "<td id='last-name-" + i + "'><span>" + jsonObject.results[i].lastName + "</span></td>";
                    text += "<td id='email-" + i + "'><span>" + jsonObject.results[i].email + "</span></td>";
                    text += "<td id='phone-" + i + "'><span>" + jsonObject.results[i].phone + "</span></td>";
                    text += "<td><button onclick='doDeleteContact(" + jsonObject.results[i].id + ")'>Delete</button></td>";
                    text += "<td><button onclick=' showEditContactModal(" + jsonObject.results[i].id + ")'>Edit</button></td>";
                    text += "<tr/>"
                }

                text += "</table>"
                document.getElementById("table-body").innerHTML = text;
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }
}

function showEditContactModal(contactId) {

    document.getElementById("updateContactId").value = contactId;
    document.getElementById('panel-update').classList.add('modal-show');
    document.getElementById('modal-backdrop').style.display = 'block';
}


function closeModal() {
    document.getElementById('panel-update').classList.remove('modal-show');
    document.getElementById('modal-backdrop').style.display = 'none';
}

function getContactIdForUpdate() {
    return document.getElementById("updateContactId").value;
}
