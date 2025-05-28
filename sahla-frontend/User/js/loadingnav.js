fetch("/sahla-frontend/User/html/shared/navbar.html")
    .then(res => res.text())
    .then(html => {
        document.getElementById("navbar-placeholder").innerHTML = html;

        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        // ✅ تحميل صورة البروفايل
        fetch("https://localhost:7273/api/Profile/Get_Picture", {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                const img = document.getElementById("profilePic");
                if (img && data.pictureUrl) {
                    img.src = `https://localhost:7273${data.pictureUrl}`;
                }
            })
            .catch(err => {
                console.error("❌ فشل تحميل الصورة:", err.message);
            });

        // ✅ إضافة رابط Dashboard حسب الدور
        try {
            const placeholder = document.getElementById("dashboard-placeholder");
            if (!placeholder) return;

            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(decodeURIComponent(escape(window.atob(base64))));

            const roles = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            const allowedRoles = ['Admin', 'SuperAdmin', 'Teacher'];

            const hasPermission = Array.isArray(roles)
                ? roles.some(role => allowedRoles.includes(role))
                : allowedRoles.includes(roles);

            if (hasPermission) {
                const dashboardLink = document.createElement("a");
                dashboardLink.href = "/sahla-frontend/Admin/html/home.html";
                dashboardLink.textContent = "Dashboard";
                dashboardLink.classList.add("nav-link");
                placeholder.replaceWith(dashboardLink);
            } else {
                placeholder.remove();
            }
        } catch (e) {
            console.error("🚫 خطأ في تحليل الدور:", e.message);
        }

        // ✅ تسجيل الخروج بعد تحميل الـ navbar بالكامل
        const logoutBtn = document.querySelector("#logoutBtn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", async function (e) {
                e.preventDefault();

                try {
                    const response = await fetch("https://localhost:7273/api/Account/logout", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        localStorage.removeItem("jwtToken");
                        window.location.href = "/sahla-frontend/User/html/login.html";
                    } else {
                        console.error("فشل في تسجيل الخروج:", response.status);
                    }
                } catch (error) {
                    console.error("حدث خطأ أثناء تسجيل الخروج:", error);
                }
            });
        } else {
            console.warn("❌ لم يتم العثور على زر تسجيل الخروج.");
        }
    });
