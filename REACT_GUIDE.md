# React Integration Guide - Product API

Welcome! This guide will help you integrate the Product Management API into your React application.

## 1. Authentication (JWT)

Most routes require a Bearer Token. You should store the token in `localStorage` after a successful login.

### Login Example

```javascript
const handleLogin = async (username, password) => {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  if (result.success) {
    localStorage.setItem("token", result.data.token);
  }
};
```

## 2. Fetching Products (Public)

The `GET /products` routes are public. You can fetch them without a token.

```javascript
useEffect(() => {
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => setProducts(data.data));
}, []);
```

## 3. Protected Operations (POST/PATCH/DELETE)

To create or update products, you **must** include the token in the `Authorization` header.

```javascript
const createProduct = async (productData) => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:3000/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return await response.json();
};
```

## 4. Swagger Documentation

For a full list of endpoints and to test the API directly, visit:

- **Local**: `http://localhost:3000/api-docs`
- **Staging**: `http://88.222.242.12:1738/api-docs`
