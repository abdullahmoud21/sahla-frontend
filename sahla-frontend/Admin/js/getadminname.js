const token = localStorage.getItem("jwtToken");

if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    const userName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    const nameElement = document.getElementById("admin-name");
    if (nameElement) {
        nameElement.textContent = `👋 Hello, ${userName} (${userRole})`;
    }

    // ✅ عدد المستخدمين
    fetch("https://localhost:7273/api/User/allusers", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
        const usersCount = document.getElementById("total-users-count");
        if (usersCount) usersCount.textContent = data;
    })
    .catch(err => console.error("❌ Error fetching users:", err));

    // ✅ عدد الكورسات
    fetch("https://localhost:7273/api/User/GetAllCourses", {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(courseCount => {
        const courseCountElement = document.getElementById("active-courses-count");
        if (courseCountElement) courseCountElement.textContent = courseCount;
    })
    .catch(err => {
        console.error("❌ Error fetching course count:", err);
        const courseCountElement = document.getElementById("active-courses-count");
        if (courseCountElement) courseCountElement.textContent = "Error";
    });
}