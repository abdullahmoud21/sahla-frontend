   document.getElementById("challengeForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("Not authorized. Please login.");
        return;
      }

      const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        expiryDate: document.getElementById("expiryDate").value,
        pointsReward: parseInt(document.getElementById("pointsReward").value),
        isCompleted: document.getElementById("isCompleted").checked,
        completedAt: document.getElementById("isCompleted").checked
          ? new Date().toISOString()
          : null
      };

      try {
        const response = await fetch("https://localhost:7273/api/Challenge/CreateChallenge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert("✅ Challenge created successfully!");
          window.location.href = "challenges.html";
        } else {
          const error = await response.text();
          alert("❌ Failed to create challenge:\n" + error);
        }
      } catch (err) {
        alert("❌ Error:\n" + err.message);
      }
    });