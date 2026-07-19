/* ==========================================
   SMARTSEAT
   Activity Manager
========================================== */

const ActivityManager = {

    storageKey: "activities",

    /* ==========================
       Get Activities
    ========================== */

    getActivities() {

        return JSON.parse(

            localStorage.getItem(this.storageKey)

        ) || [];

    },

    /* ==========================
       Save Activities
    ========================== */

    saveActivities(data) {

        localStorage.setItem(

            this.storageKey,

            JSON.stringify(data)

        );

    },

    /* ==========================
       Add Activity
    ========================== */

    addActivity(action, status = "Completed") {

        const activities = this.getActivities();

        const now = new Date();

        const activity = {

            id: Date.now(),

            action: action,

            status: status,

            date: now.toLocaleDateString(),

            time: now.toLocaleTimeString([], {

                hour: "2-digit",

                minute: "2-digit"

            })

        };

        activities.unshift(activity);

        if (activities.length > 20) {

            activities.pop();

        }

        this.saveActivities(activities);

    },

    /* ==========================
       Delete All Activities
    ========================== */

    clearActivities() {

        localStorage.removeItem(this.storageKey);

    },

    /* ==========================
       Render Activity Table
    ========================== */

    render(tableId) {

        const table = document.getElementById(tableId);

        if (!table) return;

        const activities = this.getActivities();

        table.innerHTML = "";

        if (activities.length === 0) {

            table.innerHTML = `

            <tr>

                <td colspan="4" class="text-center">

                    No Recent Activity

                </td>

            </tr>

            `;

            return;

        }

        activities.forEach(item => {

            table.innerHTML += `

            <tr>

                <td>${item.action}</td>

                <td>${item.date}</td>

                <td>${item.time}</td>

                <td>

                    <span class="badge bg-success">

                        ${item.status}

                    </span>

                </td>

            </tr>

            `;

        });

    }

};

console.log("✅ Activity Manager Loaded");