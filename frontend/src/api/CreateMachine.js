export default async function createProject(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    try {
        const response = await fetch("catalog/project/create", {
            method: "POST",
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            console.log('Project created successfully:', result.message);
        } else {
            console.error('Error creating project:', result.message || result);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
}
