document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem("jwtToken");
    const id = new URLSearchParams(window.location.search).get("id");

    if (!token || !id) {
      alert("Not authorized or no course selected.");
      return;
    }

    const form = document.getElementById("courseForm");

    // 🟢 تحميل البيانات القديمة
    try {
      const response = await fetch(`https://localhost:7273/api/Course/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch course");

      const course = await response.json();
      document.getElementById("coursId").value = course.coursId;
      document.getElementById("title").value = course.title;
      document.getElementById("description").value = course.description || "";
      document.getElementById("level").value = course.level;
      document.getElementById("category").value = course.category;
    } catch (err) {
      alert("Failed to load course: " + err.message);
    }

    // 🟢 حفظ التعديلات
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const token = localStorage.getItem("jwtToken");

      try {
        const response = await fetch("https://localhost:7273/api/Course/UpdateCourse", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          alert("✅ Course updated successfully!");
          window.location.href = "courses.html";
        } else {
          const error = await response.text();
          alert("❌ Failed to update course:\n" + error);
        }
      } catch (err) {
        alert("❌ Error:\n" + err.message);
      }
    });
  });