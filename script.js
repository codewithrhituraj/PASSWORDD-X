// Function to show a specific section and hide others
function showSection(sectionId) {
    const sections = ['passwordManagerSection', 'homeSection', 'aboutSection', 'contactSection'];
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            element.style.display = section === sectionId ? 'block' : 'none';
        }
    });
}

// Function to show feedback when text is copied
function copyText(txt, element) {
    navigator.clipboard.writeText(txt).then(
        () => {
            const originalIcon = element.innerHTML;
            element.innerHTML = "Copied!";
            element.style.color = "green";

            setTimeout(() => {
                element.innerHTML = originalIcon;
                element.style.color = "";
            }, 1000);
        },
        () => {
            alert("Clipboard copying failed");
        }
    );
}

function maskPassword(pass) {
    return "*".repeat(pass.length);
}

const getFaviconUrl = (website) => {
    try {
        let domain = (new URL(website)).hostname;
        return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
    } catch (error) {
        console.error("Invalid URL:", website);
        return "";
    }
};

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords");
    if (data) {
        let arr = JSON.parse(data);
        let updatedArr = arr.filter((e) => e.website !== website);
        localStorage.setItem("passwords", JSON.stringify(updatedArr));
        alert(`Successfully deleted ${website}'s password`);
        showPasswords();
    }
};

const showPasswords = () => {
    let tb = document.querySelector("tbody");
    let data = localStorage.getItem("passwords");

    if (!data || JSON.parse(data).length === 0) {
        tb.innerHTML = "<tr><td colspan='4'>No Data To Show</td></tr>";
    } else {
        let arr = JSON.parse(data);
        let str = arr.map((element) => `
        <tr>
            <td>
                <img src="${getFaviconUrl(element.website)}" alt="" style='width:16px;height:16px;'> ${element.website} 
                <span onclick='copyText("${element.website}", this)' class='copy-icon'>📋</span>
            </td>
            <td>${element.username} 
                <span onclick='copyText("${element.username}", this)' class='copy-icon'>📋</span>
            </td>
            <td>${maskPassword(element.password)} 
                <span onclick='copyText("${element.password}", this)' class='copy-icon'>📋</span>
            </td>
            <td><button class="btn btn-sm btn-danger" onclick="deletePassword('${element.website}')">Delete</button></td>
        </tr>`).join("");

        tb.innerHTML = str;
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Event listeners for navigation links
    document.getElementById('homeLink').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('homeSection');
    });

    document.getElementById('aboutLink').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('aboutSection');
    });

    document.getElementById('contactLink').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('contactSection');
    });

    // Event listener for the PassX logo to show the main content
    document.querySelector('.navbar-brand').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('passwordManagerSection');
    });

    // Event listener for form submission
    document.querySelector("#passwordForm").addEventListener("submit", (e) => {
        e.preventDefault();
        
        let website = document.getElementById("website").value;
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        let passwords = localStorage.getItem("passwords");
        let json = passwords ? JSON.parse(passwords) : [];

        json.push({ website, username, password });
        localStorage.setItem("passwords", JSON.stringify(json));
        
        alert("Password Saved");
        showPasswords();

        // Clear form fields
        document.getElementById("website").value = "";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    });

    showSection('passwordManagerSection'); // Show password manager by default
    showPasswords(); // Initial call to show passwords when the page loads
});
