 document.addEventListener("DOMContentLoaded", async function () {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
            alert("You are not logged in.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7273/api/Course/GetMyCourses", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const error = await response.text();
                alert("Error fetching courses:\n" + error);
                return;
            }

            const result = await response.json();
            const courses = result.data;

            const tbody = document.querySelector("table tbody");
            tbody.innerHTML = ""; // Clear the static row

            courses.forEach(course => {
                const row = `
                    <tr>
                        <td>${course.coursId}</td>
                        <td>${course.title}</td>
                        <td>${course.level}</td>
                        <td>${course.category}</td>
                        <td>${new Date(course.createdAt).toLocaleDateString()}</td>
                        <td>
                            <a href="EditCourses.html?id=${course.coursId}" class="btn btn-small btn-edit">Edit</a>
                            <button class="btn btn-small btn-delete" onclick="confirmDelete('${course.coursId}')">Delete</button>
                        </td>
                    </tr>`;
                tbody.insertAdjacentHTML("beforeend", row);
            });
        } catch (error) {
            alert("Error: " + error.message);
        }
    });

    // ✅ دالة الحذف باستخدام SweetAlert
    async function confirmDelete(id) {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            Swal.fire("Unauthorized", "Please login first.", "error");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "This course will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://localhost:7273/api/Course/DeleteCourse?id=${id}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        Swal.fire("Deleted!", "The course has been deleted.", "success")
                            .then(() => location.reload());
                    } else {
                        const errorText = await response.text();
                        Swal.fire("Error", errorText, "error");
                    }
                } catch (err) {
                    Swal.fire("Error", err.message, "error");
                }
            }
        });
    }