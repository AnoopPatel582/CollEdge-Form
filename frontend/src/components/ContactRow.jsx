function ContactRow({ contact, onDelete }) {
  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.phone}</td>
      <td>{contact.email || "-"}</td>
      <td>{contact.message || "-"}</td>
      <td>
        <button onClick={() => onDelete(contact._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default ContactRow;
