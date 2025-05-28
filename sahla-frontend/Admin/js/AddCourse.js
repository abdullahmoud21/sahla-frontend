    document.getElementById("courseForm").addEventListener("submit", async function (e) {
      e.preventDefault();

      const token = localStorage.getItem("jwtToken");
      if (!token) {
        alert("You are not logged in. Please login first.");
        return;
      }

      const form = document.getElementById("courseForm");
      const formData = new FormData(form); // ✅ كل العناصر هتتبعت تلقائيًا
      formData.append("createdAt", new Date().toISOString()); // لو DTO بيقبل createdAt

      try {
        const response = await fetch("https://localhost:7273/api/Course/CreateCourses", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}` // ✅ مفيش Content-Type هنا
          },
          body: formData
        });

        if (response.ok) {
          alert("✅ Course created successfully!");
          window.location.href = "courses.html";
        } else {
          const error = await response.text();
          alert("❌ Failed to create course:\n" + error);
        }
      } catch (err) {
        alert("❌ Error:\n" + err.message);
      }
    });