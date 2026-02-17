document.getElementById("login-form").addEventListener("submit", async e => {
  e.preventDefault(); // REQUIRED

  const User = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const res = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      User,
      password
    })
  });
  const data = await res.json();
  if (data.success) {
    window.location.href = "/dum.html";
  } else {
    alert("Login failed");
  }
});