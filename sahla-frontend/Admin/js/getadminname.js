const token = localStorage.getItem("jwtToken");

if (token) {
    // نفك التوكن علشان نطلع البيانات منه
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));

    // نقرأ الاسم والدور (الوظيفة) من التوكن
    const userName = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    const userRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // نعرض الاسم في الصفحة
    const nameElement = document.getElementById("admin-name");
    if (nameElement) {
        nameElement.textContent = `👋 Hello, ${userName} (${userRole})`;
    }

    // ✅ جلب عدد المستخدمين من API
  fetch("https://localhost:7273/api/User/allusers", {
    headers: {
        "Authorization": `Bearer ${token}`
    }
})
.then(response => {
    if (!response.ok) throw new Error("فشل في جلب المستخدمين");
    return response.json();
})
.then(data => {
    const totalUsers = data; // ✅ لأنه عدد مباشر
    const totalUsersElement = document.getElementById("total-users-count");
    if (totalUsersElement) {
        totalUsersElement.textContent = totalUsers;
    }
})
.catch(error => {
    console.error("❌ خطأ في جلب عدد المستخدمين:", error);
});
}
