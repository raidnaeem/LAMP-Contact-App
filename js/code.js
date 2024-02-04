const urlBase = 'http://cop4331c-group27.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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

// LOGIN AND SIGNUP COMPLETE

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
        document.getElementById("error-message").textContent = "Invalid password. Please create a password with at least 6 characters and 1 digit.";
        return;
    }

    if (password != verify) {
        document.getElementById("error-message").textContent = "Passwords do not match.";
        return;
    }

    if (firstName == "" || lastName == "" || login == "" || password == "" || verify == "" ) {
        document.getElementById("error-message").textContent = "One or more fields were left blank. Please fill them to proceed.";
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
                    document.getElementById("error-message").textContent = "User already exists.";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                location.reload();
                alert("Successfully added user!");
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log("Registration failed: " + err.message);
    }
}


// EVERYTHING BELOW IS BEYOND LOGIN/SIGNUP NEEDS FIXING!!!


function doAddContact() {
    readCookie();
    let addFirstName = document.getElementById("addFirstName").value;
    let addLastName = document.getElementById("addLastName").value;
    let addPhoneNumber = document.getElementById("addPhoneNumber").value;
    let addEmailAddress = document.getElementById("addEmailAddress").value;

    if (addFirstName === "" || addLastName === "" || addPhoneNumber === "" || addEmailAddress === "") {
        document.getElementById("error-message").textContent = "One or more fields have been left blank. Please fill them to proceed.";
        return;
    }

    if (!validatePhoneNumber(addPhoneNumber)) {
        document.getElementById("error-message").textContent = "Invalid phone number.";
        return;
    }

    if (!validateEmail(addEmailAddress)) {
        document.getElementById("error-message").textContent = "Invalid email. Please enter a valid email address to proceed.";
        return;
    }

    // You can add more validation checks if needed

    let addData = {
        FirstName:addFirstName,
		LastName:addLastName,
		Phone:addPhoneNumber,
		Email:addEmailAddress,
		UserId:userId
    };

    console.log(addData);

    let jsonPayload = JSON.stringify(addData);

    console.log(jsonPayload);

    let url = urlBase + '/AddContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4) 
			{
                if (this.status == 200) 
				{
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error === "") 
					{
                        document.getElementById("error-message").innerHTML = "Contact has been added";
                        document.getElementById("addFirstName").value = "";
                        document.getElementById("addLastName").value = "";
                        document.getElementById("addPhoneNumber").value = "";
                        document.getElementById("addEmailAddress").value = "";
                    }
					else 
					{
                        document.getElementById("error-message").innerHTML = jsonObject.error;
                    }
                } 
				else 
				{
                    document.getElementById("error-message").innerHTML = "Error adding contact. Please try again.";
                }
            }
        };

        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.error("Add contact failed: " + err.message);
    }
}


function doUpdateContactInfo() {
	let updateUserName = document.getElementById("updateUserName").value;
    let updateFirstName = document.getElementById("updateFirstName").value;
    let updateLastName = document.getElementById("updateLastName").value;
	let updatePhone = document.getElementById("updatePhone").value;
    let updateEmail = document.getElementById("updateEmail").value;

    if (firstName == "" || lastName == "" || login == "" || password == "" || verify == "" || phoneNumber == "" || emailAddress == "") {
        document.getElementById("error-message").textContent = "One or more fields have been left blank. Please fill them to proceed.";
        return;
    }

    let updateData = {
        userId: userId,
		userName: updateUserName,
        firstName: updateFirstName,
        lastName: updateLastName,
		phoneNumber: updatePhone,
		emailAddress: updateEmail
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
                    doViewInfo();

                    // You can also redirect to the home page or perform other actions as needed
                } else {
                    alert("Failed to update contact information. Please try again.");
                }
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Update failed: " + err.message);
    }
}


function saveCookie(){
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	console.log(data);
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
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


function doViewInfo()
{
	window.location.href = "info.html";
}


function doAdd()
{
	window.location.href = "add.html";
}

function doSearch()
{
	window.location.href = "search.html";
}

function doHome()
{
	window.location.href = "homepage.html";
}


function doSearchContacts() {
    let search = document.getElementById("search").value;
    
    if (!search) {
        document.getElementById("error-message").textContent = "Please enter a search query.";
        return;
    }

    // Example API endpoint for searching contacts
    let url = urlBase + '/SearchContact.' + extension;

    let searchData = { search: search };
    let jsonPayload = JSON.stringify(searchData);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let searchResults = JSON.parse(xhr.responseText);

                // Handle search results, for example, display them on the page
                displaySearchResults(searchResults);
            }
        };

        xhr.send(jsonPayload);
    } catch (err) {
        console.error("Search failed: " + err.message);
    }
}


function displaySearchResults(results) {
    // Assuming you have an element with the id "searchResults" to display the results
    let searchResultsContainer = document.getElementById("searchResults");

    // Clear previous search results
    searchResultsContainer.innerHTML = "";

    if (results.length === 0) {
        searchResultsContainer.innerHTML = "No results found.";
        return;
    }

    // Iterate through the results and display them
    for (let i = 0; i < results.length; i++) {
        let contact = results[i];

        let resultElement = document.createElement("div");
        resultElement.innerHTML = `${contact.firstName} ${contact.lastName} - ${contact.email}`; // Adjust fields as per your contact structure
        searchResultsContainer.appendChild(resultElement);
    };
}