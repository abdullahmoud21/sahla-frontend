   document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("userForm");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const token = localStorage.getItem("jwtToken");
            if (!token) {
                alert("❌ Unauthorized: Please login first.");
                return;
            }

            const newUser = {
                userName: document.getElementById("UserName").value.trim(),
                email: document.getElementById("email").value.trim(),
                password: document.getElementById("password").value,
                address: document.getElementById("address").value.trim()
            };

            try {
                const response = await fetch("https://localhost:7273/api/User/CreateUser", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(newUser)
                });

                const data = await response.json();

                if (response.ok) {
                    alert("✅ User created successfully!");
                    window.location.href = "users.html";
                } else {
                    if (data.error) {
                        alert("❌ " + data.error); // زي "Email is already in use."
                    } else {
                        alert("❌ Failed to create user. Please check your data.");
                        console.error(data);
                    }
                }
            } catch (err) {
                console.error("Error:", err);
                alert("❌ Network error. Please try again later.");
            }
        });
    });