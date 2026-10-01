import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


// =============================
// FIREBASE CONFIGURATION
// =============================

const firebaseConfig = {
    apiKey: "AIzaSyBOXAYel4xvnXSv31GGhhy4bzSbPLgblNw",
    authDomain: "smart-medicine-system-d8b6c.firebaseapp.com",
    projectId: "smart-medicine-system-d8b6c",
    storageBucket: "smart-medicine-system-d8b6c.firebasestorage.app",
    messagingSenderId: "257438247903",
    appId: "1:257438247903:web:dae15d7f02339e3e0fb26a"
};


// =============================
// INITIALIZE FIREBASE
// =============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app, "aban");

console.log("Firebase connected successfully!");


// =============================
// LOAD PATIENT
// =============================

async function loadPatient() {

    try {

        const patientRef =
            doc(db, "Patients", "P001");

        const patientSnap =
            await getDoc(patientRef);


        if (!patientSnap.exists()) {

            console.log("Patient P001 not found.");

            return;
        }


        const patient =
            patientSnap.data();


        console.log(
            "Patient data from Firebase:",
            patient
        );


        const patientName =
            document.getElementById("patientName");

        const topPatientName =
            document.getElementById("topPatientName");

        const patientAge =
            document.getElementById("patientAge");


        if (patientName && patient.name) {

            patientName.textContent =
                patient.name;

        }


        if (topPatientName && patient.name) {

            topPatientName.textContent =
                patient.name;

        }


        if (patientAge && patient.age) {

            patientAge.textContent =
                patient.age + " Years";

        }

    }

    catch (error) {

        console.error(
            "Error loading patient:",
            error
        );

    }

}


// =============================
// LOAD MEDICINES
// =============================

async function loadMedicines() {

    try {

        const medicinesRef =
            collection(db, "Medicines");

        const medicinesSnapshot =
            await getDocs(medicinesRef);


        console.log(
            "Medicines from Firebase:",
            medicinesSnapshot.size
        );


        const medicines = [];


        medicinesSnapshot.forEach(function(document) {

            const medicine =
                document.data();


            // Only get medicines belonging
            // to patient P001

            if (medicine.patientId === "P001") {

                medicines.push({
                    id: document.id,
                    name: medicine.name || "Medicine",
                    compartment: medicine.compartment || "--",
                    stock: medicine.stock || 0,
                    expiry: medicine.expiry || "--"
                });

            }

        });


        console.log(
            "Patient medicines:",
            medicines
        );


        // =============================
        // SAVE MEDICINES FOR WEBSITE
        // =============================

        localStorage.setItem(
            "firebaseMedicines",
            JSON.stringify(medicines)
        );


    }

    catch (error) {

        console.error(
            "Error loading medicines:",
            error
        );

    }

}


// =============================
// START FIREBASE DATA
// =============================

async function loadFirebaseData() {

    await loadPatient();

    await loadMedicines();

}


loadFirebaseData();


// =============================
// EXPORT DATABASE
// =============================

export { db };
