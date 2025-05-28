  
  document.addEventListener("DOMContentLoaded", async () => {
        const token = localStorage.getItem("jwtToken");

        try {
            const res = await fetch("https://localhost:7273/api/Challenge/GetAllChallenges", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Failed to fetch challenges");

            const challenges = await res.json();
            const tbody = document.querySelector("table tbody");
            tbody.innerHTML = "";

            challenges.forEach(challenge => {
                const row = `
                    <tr>
                        <td>${challenge.challengeId}</td>
                        <td>${challenge.title}</td>
                        <td>${challenge.expiryDate?.split('T')[0]}</td>
                        <td>${challenge.pointsReward}</td>
                        <td>${challenge.isCompleted ? "Yes" : "No"}</td>
                        <td>${challenge.userId ?? '—'}</td>
                        <td>
                            <a href="EditChallenge.html?id=${challenge.challengeId}" class="btn btn-small btn-edit">Edit</a>
                            <button class="btn btn-small btn-delete" onclick="confirmDelete('${challenge.challengeId}')">Delete</button>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML("beforeend", row);
            });
        } catch (err) {
            alert("❌ Error loading challenges: " + err.message);
        }
    });

     function confirmDelete(id) {
    const token = localStorage.getItem("jwtToken");

    Swal.fire({
      title: "Are you sure?",
      text: "This challenge will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://localhost:7273/api/Challenge/DeleteChallenge?id=${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => {
          if (!res.ok) throw new Error("Delete failed");
          Swal.fire("Deleted!", "The challenge has been deleted.", "success").then(() => {
            location.reload();
          });
        })
        .catch(err => {
          Swal.fire("Error", "❌ Failed to delete challenge: " + err.message, "error");
        });
      }
    });
  }
    
        
    