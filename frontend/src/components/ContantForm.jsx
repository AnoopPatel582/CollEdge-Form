import { useState, useEffect } from 'react';
import ContactRow from "./ContactRow";
import './ContactForm.css';

function ContactForm() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errors, setErrors] = useState({});
    const [contacts, setContacts] = useState([]);

    const validate = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone is required";
        } else {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(phone)) {
                newErrors.phone = "Phone number must be exactly 10 digits";
            }
        }

        if (email.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                newErrors.email = "Enter a valid email address";
            }
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchContacts = async () => {
        try {
            const response = await fetch("https://colledge-form.onrender.com/api/contacts");
            const data = await response.json();
            setContacts(data);
        } catch (error) {
            console.error("Failed to fetch contacts", error);
        }
    };

    const deleteContact = async (id) => {
        try {
            await fetch(`https://colledge-form.onrender.com/api/contacts/${id}`, {
                method: "DELETE",
            });
            fetchContacts(); // refresh list
        } catch (error) {
            console.error("Delete failed", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // console.log({ name, phone, email, message });
        await fetch("https://colledge-form.onrender.com/api/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone, email, message })
        });


        setSuccessMessage("Contact added successfully ✅");
        setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        await fetchContacts();

        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setErrors({});
    };


    const isFormValid = name.trim() && phone.trim();
    useEffect(() => {
        fetchContacts();
    }, []);



    return (
        <div className="contact-form">
            <h2>Add New Contact</h2>
            {successMessage && (
                <p className="success">{successMessage}</p>
            )}


            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
                {errors.name && <p className="error">{errors.name}</p>}
                <label>
                    Phone:
                    <input
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </label>
                {errors.phone && <p className="error">{errors.phone}</p>}
                <label>
                    Email:
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </label>
                {errors.email && <p className="error">{errors.email}</p>}
                <label>
                    Message:
                    <textarea
                        placeholder="Enter your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        cols={50}
                    />
                </label>
                <button type="submit" disabled={!isFormValid}>
                    Add Contact
                </button>

            </form>

            <h3>Saved Contacts</h3>

            {contacts.length === 0 ? (
                <p>No contacts found</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => (
                            <ContactRow
                                key={contact._id}
                                contact={contact}
                                onDelete={deleteContact}
                            />
                        ))}
                    </tbody>

                </table>
            )}

        </div>
    );
}
export default ContactForm;