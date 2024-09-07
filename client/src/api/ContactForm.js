export default function ContactForm(e) {
    const formData = new FormData(e.target);
    const urlEncodedData = new URLSearchParams(formData).toString();
    console.log("my form", urlEncodedData);
    fetch("catalog/user/sendmail",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: urlEncodedData
        })
        .then(res => res.json())
        .then(result => {
            if (result.ok) {
                return result
            }
            throw new Error(result.error)
        })
        .catch((err) => {
            console.error(err);
            return err
        });
}