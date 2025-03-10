let selectedLink = null;
let tabRef = null;
let allShows = [];
let openedTabs = new Set(); // Track opened tabs using a Set

// Open the selected tab
function openTab() {
    if (selectedLink && (!tabRef || tabRef.closed)) {
        tabRef = window.open(selectedLink, '_blank');
        if (tabRef) {
            openedTabs.add(tabRef);
        }
    }
    setTimeout(closeOtherTabs, 2000); // Delay to ensure tab is opened first
}

// Monitor and reopen tabs if closed
function monitorTab() {
    setInterval(() => {
        if (selectedLink && (!tabRef || tabRef.closed)) {
            openTab();
        }
    }, 1000);
}

// Close all tabs except for the main website and selected link
function closeOtherTabs() {
    openedTabs.forEach(tab => {
        if (tab !== tabRef && tab !== window && !tab.closed) {
            tab.close();
        }
    });
    // Remove closed tabs from tracking
    openedTabs = new Set([...openedTabs].filter(tab => !tab.closed));
}

// Handle main dropdown selection
function selectMain(event) {
    const selectedName = event.target.value;
    const actDropdownContainer = document.getElementById("actDropdownContainer");
    const actSelection = document.getElementById("actSelection");
    const petText = document.getElementById("petText");

    // Reset act selection
    actSelection.innerHTML = `<option value="none">Select an Act</option>`;
    actDropdownContainer.style.display = "none";
    petText.textContent = ""; // Clear pet text when no selection

    // Find the selected show in JSON
    const selectedShow = allShows.find(show => show.name === selectedName);

    if (selectedShow) {
        // Display pet text
        if (selectedShow.pet) {
            petText.textContent = selectedShow.pet;
        }
        
        if (selectedShow.acts) {
            // Show second dropdown for multi-act selections
            actDropdownContainer.style.display = "block";
            selectedShow.acts.forEach(act => {
                const option = document.createElement("option");
                option.value = act.url;
                option.textContent = act.name;
                actSelection.appendChild(option);
            });
            
            // Reset main selection link
            selectedLink = null;
        } else {
            // Single link show: Open immediately
            selectedLink = selectedShow.url;
            openTab();
        }
    }
}

// Handle act dropdown selection
function selectAct(event) {
    selectedLink = event.target.value;
    openTab();
}

// Fetch links from JSON and populate dropdown
document.addEventListener("DOMContentLoaded", () => {
    const mainSelection = document.getElementById("mainSelection");
    const actSelection = document.getElementById("actSelection");
    const petText = document.getElementById("petText");

    fetch("links.json")
        .then(response => response.json())
        .then(data => {
            allShows = data; // Store all shows in a variable
            mainSelection.innerHTML = `<option value="none">Select a Show</option>`;

            data.forEach(show => {
                const option = document.createElement("option");
                option.value = show.name;
                option.textContent = show.name;
                mainSelection.appendChild(option);
            });
        })
        .catch(error => console.error("Error loading JSON:", error));

    mainSelection.addEventListener("change", selectMain);
    actSelection.addEventListener("change", selectAct);
    monitorTab();
});
