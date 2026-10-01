/* =========================================================
   SMART MEDICINE AI - MAIN SCRIPT
   Uses login/localStorage as the main patient data source
========================================================= */


/* =========================
   LOGIN / BASIC FUNCTIONS
========================= */

function login() {
    window.location.href = "dashboard.html";
}


/* =========================
   EMERGENCY SOS
========================= */

function sendSOS() {

    const caregiverName =
        localStorage.getItem("caregiverName") || "Caregiver";

    const caregiverNumber =
        localStorage.getItem("caregiverNumber");

    if (!caregiverNumber) {
        alert("No caregiver number found. Please register first.");
        return;
    }

    if (
        confirm(
            "Call " +
            caregiverName +
            " for emergency assistance?"
        )
    ) {
        window.location.href = "tel:" + caregiverNumber;
    }
}


/* =========================
   DATE + CLOCK
========================= */

function updateDateTime() {

    const now = new Date();

    const hour = now.getHours();

    let greeting;

    if (hour < 12) {
        greeting = "Good Morning";
    }
    else if (hour < 17) {
        greeting = "Good Afternoon";
    }
    else if (hour < 21) {
        greeting = "Good Evening";
    }
    else {
        greeting = "Good Night";
    }


    const greetingElement =
        document.getElementById("greeting");

    const dateElement =
        document.getElementById("date");

    const clockElement =
        document.getElementById("clock");


    if (greetingElement) {
        greetingElement.textContent = greeting;
    }


    if (dateElement) {

        dateElement.textContent =
            now.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );
    }


    if (clockElement) {

        clockElement.textContent =
            now.toLocaleTimeString(
                "en-IN",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true
                }
            );
    }
}


/* =========================
   DATE HELPER
========================= */

function todayDate() {

    const d = new Date();

    return (
        d.getFullYear() +
        "-" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(d.getDate()).padStart(2, "0")
    );
}


/* =========================
   TIME FORMAT
========================= */

function formatMedicineTime(time) {

    if (!time) {
        return "--";
    }

    const parts = String(time).split(":");

    if (parts.length < 2) {
        return time;
    }

    let hour = Number(parts[0]);

    const minute = parts[1];

    if (Number.isNaN(hour)) {
        return time;
    }

    const period = hour >= 12 ? "PM" : "AM";

    hour = hour % 12 || 12;

    return hour + ":" + minute + " " + period;
}


/* =========================
   GET LOGIN MEDICINES
========================= */

function getMedicines() {

    const medicines = [];

    for (let i = 1; i <= 3; i++) {

        const name =
            (
                localStorage.getItem(
                    "medicine" + i
                ) || ""
            ).trim();

        const time =
            localStorage.getItem(
                "medicine" + i + "Time"
            ) || "";


        medicines.push({

            slot: i,

            id:
                "local-medicine-" + i,

            name:
                name ||
                "Medicine " + i,

            time:
                time ||
                [
                    "08:00",
                    "14:00",
                    "20:00"
                ][i - 1]

        });
    }

    return medicines;
}


/* =========================
   MEDICINE STATUS STORAGE
========================= */

function getTakenMedicines() {

    const saved =
        localStorage.getItem(
            "takenMedicines"
        );

    if (!saved) {
        return {};
    }

    try {
        return JSON.parse(saved);
    }
    catch (error) {
        return {};
    }
}


function saveTakenMedicines(data) {

    localStorage.setItem(
        "takenMedicines",
        JSON.stringify(data)
    );
}


/* =========================
   CHECK IF MEDICINE IS TAKEN
========================= */

function isMedicineTaken(id) {

    const data =
        getTakenMedicines();

    const today =
        todayDate();

    return (
        data[today] &&
        data[today][id] === true
    );
}


/* =========================
   MARK MEDICINE AS TAKEN
========================= */

function markMedicineTaken(id) {

    const data =
        getTakenMedicines();

    const today =
        todayDate();


    if (!data[today]) {
        data[today] = {};
    }


    data[today][id] = true;


    saveTakenMedicines(data);


    window.dispatchEvent(
        new Event("medicineStatusChanged")
    );
}


/* =========================
   UNTAKE MEDICINE
========================= */

function unTakeMedicine(id) {

    const data =
        getTakenMedicines();

    const today =
        todayDate();


    if (data[today]) {

        delete data[today][id];

        saveTakenMedicines(data);
    }


    window.dispatchEvent(
        new Event("medicineStatusChanged")
    );
}


/* =========================
   CLEAN OLD STATUS
========================= */

function cleanOldMedicineStatus() {

    const data =
        getTakenMedicines();

    const today =
        todayDate();


    Object.keys(data).forEach(
        function (date) {

            if (date !== today) {
                delete data[date];
            }

        }
    );


    saveTakenMedicines(data);
}


/* =========================
   START CLOCK
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDateTime();

        setInterval(
            updateDateTime,
            1000
        );

        cleanOldMedicineStatus();

    }
);
