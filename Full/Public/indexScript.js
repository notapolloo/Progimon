
    console.log("Index script loaded");
  
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // stops page from being replaced

    const response = await fetch("/login", {
      method: "POST", 
      
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = "/dum.html";
    } else {
      alert("Login failed");
    }
  });
