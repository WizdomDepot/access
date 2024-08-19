const networkOptions = {
    MTN_PLAN: [
        { text: "SME", value: "SME" },
        { text: "SME2", value: "SME2" },
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "DATA COUPONS", value: "DATA COUPONS" },
        { text: "GIFTING", value: "GIFTING" },
        { text: "ALL", value: "ALL" },
    ],
    GLO_PLAN: [
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "GIFTING", value: "GIFTING" },
        { text: "ALL", value: "ALL" },
    ],
    AIRTEL_PLAN: [
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "GIFTING", value: "GIFTING" },
        { text: "ALL", value: "ALL" },
    ],
    nineMOBILE_PLAN: [
        { text: "CORPORATE GIFTING", value: "CORPORATE" },
        { text: "SME", value: "SME" },
        { text: "ALL", value: "ALL" },
    ]
};

const planOptions = {
    SME: [
        { text: "1GB", value: "1GB" },
        { text: "2GB", value: "2GB" }
    ],
    GIFTING: [
        { text: "500MB", value: "500MB" },
        { text: "1GB", value: "1GB" }
    ],
    CORPORATE: [
        { text: "5GB", value: "5GB" },
        { text: "10GB", value: "10GB" }
    ]
};

let plan_d;
let data_p;
fetch('https://culpa.com.ng/api/user/pricing')
    .then(response => response.json())
    .then(data => {
        plan_d = data.alld;
    })
    .catch(error => console.error('Error fetching data:', error));

document.getElementById('id_network').addEventListener('change', () => {
    updatePlanType();
    resetOptions();
});

document.getElementById('id_data_type').addEventListener('change', updatePlan);

function updatePlanType() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type");
    const plan = document.getElementById("plan");
    planType.innerHTML = "";
    plan.innerHTML = "";
    document.getElementById("id_Amount").value = ""
    plan.options.add(new Option("-----", ""));

    if (networkOptions[networkType]) {
        planType.options.add(new Option("-----", ""));
        networkOptions[networkType].forEach((option) => {
            planType.options.add(new Option(option.text, option.value));
        });
    }
}

function updatePlan() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type").value;
    const plan = document.getElementById("plan");
    plan.innerHTML = "";
    document.getElementById("id_Amount").value = ""

    if (plan_d) {
        plan_d.forEach(networkPlan => {
            if (networkPlan[networkType] && networkPlan[networkType][planType]) {
                plan.options.add(new Option("-----", ""));
                networkPlan[networkType][planType].forEach((option) => {
                    plan.options.add(new Option(`${option.plan_type} - ${option.plan} (${option.month_validate} months)`, option.id));
                });
            }
        });
    }
}

function plandetail() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type").value;
    const plan = document.getElementById("plan").value;

    if (plan_d) {
        plan_d.forEach(networkPlan => {
            if (networkPlan[networkType] && networkPlan[networkType][planType]) {
                const filteredArray = networkPlan[networkType][planType].filter(obj => obj.id == plan);
                data_p = filteredArray[0]
                document.getElementById("id_Amount").value = filteredArray[0].updated_plan_amount;
            }
        });
    }
}

function resetOptions() {
    const networkType = document.getElementById("id_network").value;
    const planType = document.getElementById("id_data_type");
    const plan = document.getElementById("plan");

    if (networkType === "") {
        planType.innerHTML = "";
        planType.options.add(new Option("-----", ""));
        plan.innerHTML = "";
        plan.options.add(new Option("-----", ""));
                        document.getElementById("id_Amount").value = ""
    }
}


async function handleSubmit(event) {
    event.preventDefault();
  let admin = document.querySelector("#admin").value
 // let userId = document.querySelector("#userId").value
 let userId = sessionStorage.getItem('userid')
 const mobileNumber = document.querySelector("#number").value
const p_data = {
  ... data_p,admin,userId,mobileNumber };

    try {
        const response = await fetch("https://culpa.com.ng/api/user/data_purchase", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(p_data),
        });
        
        if (response) {
            const result = await response.json();
                        showModal(result.message);
            if (result.issucess === "true") {
            showModal(result.apiResponse || "Data purchase successful!");
            }
        } else {
            const errorText = await response.text();
            console.error("Error:", response.statusText);
            showModal("Error: " + response.statusText + " - " + errorText);
        }
    } catch (error) {
        console.error("Error:", error);
        showModal("An error occurred: " + error.message);
    }
}

document.getElementById('signupForm').addEventListener('submit', handleSubmit);

function showModal(message) {
    const modal = document.getElementById("myModal");
    const modalMessage = document.getElementById("modalMessage");
    const span = document.getElementsByClassName("close")[0];

    modalMessage.textContent = message;
    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


