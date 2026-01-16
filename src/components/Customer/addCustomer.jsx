// src/components/AddProduct.js
import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:1338/api/products', {
            data: {
                name: name,
                price: parseFloat(price),
                stock: parseInt(stock)
            }
        })
            .then(response => {
                console.log('Product added:', response.data);
            })
            .catch(error => {
                console.error('Error adding product:', error);
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </label>
            <label>
                Stock:
                <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
            </label>
            <button type="submit">Add Product</button>
        </form>
    );
};

export default AddProduct;
