 const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        fetch(`https://localhost:7273/api/User/getbyid?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("❌ فشل في تحميل بيانات المستخدم");
            return res.json();
        })
        .then(data => {
            document.querySelector('[name="id"]').value = data.id;
document.querySelector('[name="UserName"]').value = data.userName;
            document.querySelector('[name="email"]').value = data.email;
            document.querySelector('[name="adress"]').value = data.adress || '';
            document.querySelector('[name="points"]').value = data.points || 0;
        })
        .catch(err => {
            alert("❌ Error loading user data: " + err.message);
            console.error(err);
        });
    }

    document.getElementById('userForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const id = new URLSearchParams(window.location.search).get("id");
        if (!id) return alert("❌ No user ID in URL.");

        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());

        fetch(`https://localhost:7273/api/User/UpdateUser?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) throw new Error('❌ Update failed');
            window.location.href = 'users.html';
        })
        .catch(err => {
            alert('❌ Error updating user: ' + err.message);
            console.error(err);
        });
    });