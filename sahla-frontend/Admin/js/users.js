   let currentPage = 1;

    function loadUsers(page = 1) {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;

        fetch(`https://localhost:7273/api/User/getalluserslist?page=${page}&pageSize=10`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            currentPage = data.currentPage;
            const tbody = document.querySelector("table tbody");
            tbody.innerHTML = "";

            if (!data.users || data.users.length === 0) {
                tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No users found</td></tr>`;
                return;
            }

            data.users.forEach(user => {
                const normalizedRole = (user.role || '').trim().toLowerCase();
                const roles = ['SuperAdmin', 'Admin', 'Teacher', 'Employee', 'Assistant', 'Student'];
                let roleOptions = '';
                roles.forEach(role => {
                    roleOptions += `<option value="${role}" ${normalizedRole === role.toLowerCase() ? 'selected' : ''}>${role}</option>`;
                });

                const blockButton = user.isBlocked
                    ? `<button class="btn btn-small btn-success" onclick="unblockUser('${user.id}')">Unblock</button>`
                    : `<button class="btn btn-small btn-warning" onclick="blockUser('${user.id}')">Block</button>`;

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.userName}</td>
                    <td>${user.email}</td>
                    <td>${user.adress ?? ''}</td>
                    <td>${user.points}</td>
                    <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                        <a href="user_form.html?id=${user.id}" class="btn btn-small btn-edit">Edit</a>
                        <button class="btn btn-small btn-delete" onclick="confirmDelete('${user.id}')">Delete</button>
                        ${blockButton}
                        <select class="role-dropdown" data-user-id="${user.id}">
                            ${roleOptions}
                        </select>
                    </td>`;
                tbody.appendChild(row);
            });

            attachRoleDropdownListeners();

            const paginationDiv = document.getElementById("pagination");
            paginationDiv.innerHTML = "";

            for (let i = 1; i <= data.totalPages; i++) {
                const btn = document.createElement("button");
                btn.textContent = i;
                if (i === data.currentPage) btn.classList.add("active");
                btn.onclick = () => loadUsers(i);
                paginationDiv.appendChild(btn);
            }
        });
    }

    function attachRoleDropdownListeners() {
        document.querySelectorAll('.role-dropdown').forEach(dropdown => {
            dropdown.addEventListener('change', function () {
                const userId = this.getAttribute('data-user-id');
                const newRole = this.value;
                const token = localStorage.getItem("jwtToken");

                fetch(`https://localhost:7273/api/User/ChangeRole?id=${userId}&role=${newRole}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                })
                .then(async res => {
                    if (!res.ok) {
                        const errorText = await res.text();
                        throw new Error(errorText);
                    }
                    alert("✅ Role updated successfully to " + newRole);
                })
                .catch(err => {
                    alert("❌ Error updating role: " + err.message);
                });
            });
        });
    }

    function confirmDelete(id) {
        if (confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
            const token = localStorage.getItem("jwtToken");
            fetch(`https://localhost:7273/api/User/DeleteUser?id=${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(res => {
                if (!res.ok) throw new Error("❌ Failed to delete user");
                alert("✅ تم حذف المستخدم بنجاح");
                loadUsers(currentPage);
            })
            .catch(err => {
                alert("❌ حدث خطأ أثناء الحذف: " + err.message);
            });
        }
    }

    function blockUser(id) {
        const days = prompt("أدخل عدد الأيام التي تريد حظر المستخدم فيها:");
        if (!days || isNaN(days) || days <= 0) {
            alert("❌ من فضلك أدخل عدد أيام صحيح.");
            return;
        }

        const token = localStorage.getItem("jwtToken");
        const lockoutDate = new Date();
        lockoutDate.setDate(lockoutDate.getDate() + parseInt(days));

        fetch(`https://localhost:7273/api/User/BlockUser?id=${id}&time=${encodeURIComponent(lockoutDate.toISOString())}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("❌ فشل في تنفيذ الحظر");
            alert("✅ تم حظر المستخدم بنجاح");
            loadUsers(currentPage);
        })
        .catch(err => {
            alert("❌ خطأ في الحظر: " + err.message);
        });
    }

    function unblockUser(id) {
        const token = localStorage.getItem("jwtToken");

        fetch(`https://localhost:7273/api/User/UnlockUser?id=${id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("❌ Failed to unblock user");
            alert("✅ تم فك الحظر بنجاح");
            loadUsers(currentPage);
        })
        .catch(err => {
            alert("❌ حصل خطأ أثناء فك الحظر: " + err.message);
        });
    }

    document.addEventListener("DOMContentLoaded", () => loadUsers());