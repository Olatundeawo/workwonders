export default async function createProject(e) {
    e.preventDefault()
    const formData = new FormData(this)
    fetch("catalog/project/create", {
        method: "POST",
        body: formData
    })
        .then(response => response.json())
        .then(result => {
            let message = result.message
            console.log(result)
            console.log(result.message)
        })
        .catch(error => console.error(error))
}