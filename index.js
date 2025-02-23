// Simulated user data (replace with actual authentication in a real app)
const users = [
    { email: 'hospital@example.com', password: 'password', role: 'hospital_staff' },
    { email: 'department@example.com', password: 'password', role: 'department_manager' },
    { email: 'admin@example.com', password: 'password', role: 'super_admin' }
];

// Simulated hospital data (replace with actual database in a real app)
let hospitalData = [
    { id: 1, patientCount: 75, bedOccupancy: 75, date: '2025-02-23' },
];

let currentUser = null;

const navMenu = document.getElementById('nav-menu');
const mainContent = document.getElementById('main-content');

// Show the role selection menu
function showRoleSelection() {
    mainContent.innerHTML = `
        <h2>Select Your Role</h2>
        <div class="role-selection">
            <button onclick="showLoginForm('hospital_staff')">Hospital Staff</button>
            <button onclick="showLoginForm('department_manager')">Department Manager</button>
            <button onclick="showLoginForm('super_admin')">Super Admin</button>
        </div>
    `;
}

// Show login form based on the selected role
function showLoginForm(role) {
    mainContent.innerHTML = `
        <h2>Login (${role.replace('_', ' ')})</h2>
        <form id="login-form">
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    `;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password, role);
    });
}

// Login function
function login(email, password, role) {
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
        currentUser = user;
        updateNavMenu();
        showDashboard();
    } else {
        alert('Invalid email or password');
    }
}

// Logout function
function logout() {
    currentUser = null;
    updateNavMenu();
    showRoleSelection();
}

// Update navigation menu based on the user role
function updateNavMenu() {
    if (currentUser) {
        navMenu.innerHTML = `
            <button onclick="showDashboard()">Dashboard</button>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        navMenu.innerHTML = `<button onclick="showRoleSelection()">Login</button>`;
    }
}

// Show dashboard based on user role
function showDashboard() {
    if (!currentUser) {
        showRoleSelection();
        return;
    }

    switch (currentUser.role) {
        case 'hospital_staff':
            showHospitalStaffDashboard();
            break;
        case 'department_manager':
            showDepartmentManagerDashboard();
            break;
        case 'super_admin':
            showSuperAdminDashboard();
            break;
    }
}

// Hospital Staff Dashboard
function showHospitalStaffDashboard() {
    mainContent.innerHTML = `
        <h2>Hospital Staff Dashboard</h2>
        <form id="update-data-form">
            <input type="number" id="patient-count" placeholder="Patient Count" required>
            <input type="number" id="bed-occupancy" placeholder="Bed Occupancy (%)" required>
            <button type="submit">Update Data</button>
        </form>
    `;

    document.getElementById('update-data-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const patientCount = document.getElementById('patient-count').value;
        const bedOccupancy = document.getElementById('bed-occupancy').value;
        updateHospitalData(patientCount, bedOccupancy);
    });
}

// Update hospital data
function updateHospitalData(patientCount, bedOccupancy) {
    const newData = {
        id: hospitalData.length + 1,
        patientCount: parseInt(patientCount),
        bedOccupancy: parseInt(bedOccupancy),
        date: new Date().toISOString().split('T')[0]
    };
    hospitalData.push(newData);
    alert('Data updated successfully');
}

// Department Manager Dashboard
function showDepartmentManagerDashboard() {
    mainContent.innerHTML = `
        <h2>Department Manager Dashboard</h2>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Patient Count</th>
                    <th>Bed Occupancy (%)</th>
                </tr>
            </thead>
            <tbody id="hospital-data">
            </tbody>
        </table>
    `;

    const tableBody = document.getElementById('hospital-data');
    tableBody.innerHTML = hospitalData.map(data => `
        <tr>
            <td>${data.date}</td>
            <td>${data.patientCount}</td>
            <td>${data.bedOccupancy}</td>
        </tr>
    `).join('');
}

// Super Admin Dashboard
function showSuperAdminDashboard() {
    mainContent.innerHTML = `
        <h2>Super Admin Dashboard</h2>
        <button onclick="addHospitalData()">Add New Data</button>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Patient Count</th>
                    <th>Bed Occupancy (%)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="hospital-data">
            </tbody>
        </table>
    `;
    updateSuperAdminTable();
}

// Update Super Admin Table
function updateSuperAdminTable() {
    const tableBody = document.getElementById('hospital-data');
    tableBody.innerHTML = hospitalData.map((data, index) => `
        <tr>
            <td>${data.date}</td>
            <td>${data.patientCount}</td>
            <td>${data.bedOccupancy}</td>
            <td>
                <button onclick="editHospitalData(${index})">Edit</button>
                <button onclick="deleteHospitalData(${index})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Add new hospital data (for Super Admin)
function addHospitalData() {
    const patientCount = prompt("Enter Patient Count:");
    const bedOccupancy = prompt("Enter Bed Occupancy (%):");
    if (patientCount && bedOccupancy) {
        updateHospitalData(patientCount, bedOccupancy);
        updateSuperAdminTable();
    }
}

// Edit hospital data (for Super Admin)
function editHospitalData(index) {
    const patientCount = prompt("Edit Patient Count:", hospitalData[index].patientCount);
    const bedOccupancy = prompt("Edit Bed Occupancy (%):", hospitalData[index].bedOccupancy);
    if (patientCount && bedOccupancy) {
        hospitalData[index].patientCount = parseInt(patientCount);
        hospitalData[index].bedOccupancy = parseInt(bedOccupancy);
        updateSuperAdminTable();
    }
}

// Delete hospital data (for Super Admin)
function deleteHospitalData(index) {
    if (confirm("Are you sure you want to delete this record?")) {
        hospitalData.splice(index, 1);
        updateSuperAdminTable();
    }
}

// Initialize the application
updateNavMenu();
showRoleSelection();
