export default function DeleteMachine(id) {
    console.log(id)
    fetch(`catalog/project/${id}/delete`, { method: 'POST' })
        .then(res => res.json())
        .then(result => console.log(result))
        .catch(err => console.error(err))
}