document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("to-do-form") as HTMLFormElement;
    const input = document.getElementById("activity-input") as HTMLInputElement;
    const list = document.getElementById("list") as HTMLUListElement;

    form.addEventListener("submit", (e: Event) => {
        e.preventDefault();

        const taskText: string = input.value;

        if (taskText === "") return;

        const taskItem: HTMLLIElement = document.createElement("li");
        taskItem.className = "flex justify-between items-center bg-list-gradient p-4 my-2 rounded-lg shadow-md h-12";

        const taskLabel: HTMLSpanElement = document.createElement("span");
        taskLabel.textContent = taskText;
        taskLabel.className = "flex-grow cursor-pointer";

        const removeButton: HTMLButtonElement = document.createElement("button");
        removeButton.className = "bg-red-500 text-white px-3 py-1 rounded-md ml-4 flex items-center justify-center";

        const trashIconSVG = `
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14h4m2-6H6m12 0H6M19 9l-1.41 1.41A2 2 0 0116 12h-4a2 2 0 01-1.59-.59L9 9m10 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v2M4 7h16a1 1 0 01.9.55l1.5 3A1 1 0 0121 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a1 1 0 01.1-.45l1.5-3A1 1 0 014 7z"/>
            </svg>
        `;

        removeButton.innerHTML = trashIconSVG;

        taskItem.appendChild(taskLabel);
        taskItem.appendChild(removeButton);
        list.append(taskItem);

        input.value = "";

        taskLabel.addEventListener("click", () => {
            taskLabel.classList.toggle("line-through");

        });

        removeButton.addEventListener("click", () => {
            list.removeChild(taskItem);
        });


    });
});
