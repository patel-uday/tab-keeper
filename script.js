let selectedLink = null;
let tabRef = null;

function openTab() {
    if (selectedLink && (!tabRef || tabRef.closed)) {
        tabRef = window.open(selectedLink, '_blank');
    }
}

function monitorTab() {
    setInterval(() => {
        if (selectedLink && (!tabRef || tabRef.closed)) {
            openTab();
        }
    }, 1000);
}

function selectLink(event) {
    const selectedOption = event.target.value;
    if (selectedOption !== "none") {
        if (selectedLink !== selectedOption) {
            selectedLink = selectedOption;
            if (tabRef && !tabRef.closed) {
                tabRef.close();
            }
            openTab();
        }
    } else {
        selectedLink = null;
        if (tabRef && !tabRef.closed) {
            tabRef.close();
        }
        tabRef = null;
    }
}

// Fetch links from JSON and populate dropdown
document.addEventListener("DOMContentLoaded", () => {
    const select = document.getElementById("linkSelection");

    fetch("links.json")
        .then(response => response.json())
        .then(data => {
            select.innerHTML = `<option value="none">Select a link</option>`; // Default option
            data.forEach(item => {
                const option = document.createElement("option");
                option.value = item.url;
                option.textContent = item.name; // Show name in dropdown
                select.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading JSON:", error));

    select.addEventListener("change", selectLink);
    monitorTab();
});
