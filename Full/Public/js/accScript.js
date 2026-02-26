
//show acc details on the page
fetch("http://localhost:3000/api/me").then(
        (response) => {return response.json()}).then(
        (response) => {
            document.querySelector("p strong").textContent = response.User;
            document.querySelector("p:nth-child(2) strong").textContent = response.Email;
        });