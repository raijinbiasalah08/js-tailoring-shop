import { useState, useEffect } from "react";
import { API } from "../api";

export default function ProductsTable() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const [editID, seteditID] = useState("");
  const [editName, seteditName] = useState("");
  const [editPrice, seteditPrice] = useState("");
  const [editImage, seteditImage] = useState("");
  const [isModalOpen, setisModalOpen] = useState(false);

  const product_url = `${API}/products`;

  useEffect(() => {
    fetch(product_url)
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
        console.log(data);
      })
      .catch((err) => console.log("Error in", err));
  }, []);

  async function submitProduct(e) {
    e.preventDefault();
    try {
      const response = await fetch(product_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: price,
          image: image,
        }),
      });

      const data = await response.json();

      setProducts((prod) => [...prod, data]);
      setName("");
      setPrice("");
      setImage("");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const response = await fetch(`${product_url}/${editID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editName,
        price: editPrice,
        image: editImage,
      }),
    });

    const data = await response.json();
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(editID) ? data : p))
    );

    setisModalOpen(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    await fetch(`${product_url}/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function openEditModal(product) {
    setisModalOpen(true);
    seteditID(product.id);
    seteditName(product.name);
    seteditPrice(product.price);
    seteditImage(product.image);
  }

  return (
    <div className="container mt-4">
      <h1>Products</h1>
      <form onSubmit={submitProduct}>
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          name="name"
          id="name"
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="price">Price</label>
        <input
          type="number"
          name="price"
          id="price"
          className="form-control mb-2"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label htmlFor="image">Image URL</label>
        <input
          type="text"
          name="image"
          id="image"
          className="form-control mb-2"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <input type="submit" className="btn btn-primary" value="Add Product" />
      </form>

      <br />
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <td scope="col">#</td>
            <td>Image</td>
            <td>Name</td>
            <td>Price</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td scope="row">{prod.id}</td>
              <td>
                <img src={prod.image} alt={prod.name} width="75" />
              </td>
              <td>{prod.name}</td>
              <td>₱{Number(prod.price).toLocaleString()}</td>

              <td>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => openEditModal(prod)}
                >
                  Edit
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => handleDelete(prod.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Product</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setisModalOpen(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="editName" className="form-label">
                      Product Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editName"
                      value={editName}
                      onChange={(e) => seteditName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editPrice" className="form-label">
                      Price
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="editPrice"
                      value={editPrice}
                      onChange={(e) => seteditPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editImage" className="form-label">
                      Image URL
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editImage"
                      value={editImage}
                      onChange={(e) => seteditImage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setisModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
