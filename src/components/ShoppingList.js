import React, { useEffect, useState } from "react";

function ShoppingList() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", category: "Produce" });

  useEffect(() => {
    fetch("http://localhost:4000/items")
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((error) => console.error("Error fetching items:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    })
      .then((res) => res.json())
      .then((data) => {
        setItems((prevItems) => [...prevItems, data]);
        setNewItem({ name: "", category: "Produce" }); // Clear form after submit
      })
      .catch((error) => console.error("Error adding item:", error));
  };

  const toggleInCart = (id, isInCart) => {
    fetch(`http://localhost:4000/items/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isInCart: !isInCart }),
    })
      .then((res) => res.json())
      .then((updatedItem) => {
        setItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? updatedItem : item))
        );
      })
      .catch((error) => console.error("Error updating item:", error));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/items/${id}`, { method: "DELETE" })
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting item:", error));
  };

  return (
    <div className="shopping-list">
      <h2>Shopping List</h2>

      <form className="new-item-form" onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            name="name"
            type="text"
            value={newItem.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Category:
          <select name="category" value={newItem.category} onChange={handleChange}>
            <option value="Produce">Produce</option>
            <option value="Dairy">Dairy</option>
            <option value="Dessert">Dessert</option>
          </select>
        </label>
        <button type="submit">Add to List</button>
      </form>

      <ul className="items-list">
        {items.map((item) => (
          <li key={item.id} className={`item ${item.isInCart ? "in-cart" : ""}`}>
            {item.name} - {item.category}
            <button onClick={() => toggleInCart(item.id, item.isInCart)}>
              {item.isInCart ? "Remove From Cart" : "Add to Cart"}
            </button>
            <button className="delete-btn" onClick={() => handleDelete(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingList;
