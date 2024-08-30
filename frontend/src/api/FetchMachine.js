export default async function fetchMachine() {
    try {
        const response = await fetch("catalog/projects");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // console.log(data[11].media.length);
        return data;
    } catch (err) {
        console.error("Error fetching machine data:", err);
        return [];
    }
}
