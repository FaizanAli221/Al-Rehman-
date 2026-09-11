/**
 * API Client service layer connecting the React frontend to the Express REST API.
 */

const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(body.error || `HTTP ${res.status}: API request failed`);
  }

  return body.data;
}

export async function fetchCategories() {
  return request("/categories");
}

export async function fetchProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  if (filters.search) params.append("search", filters.search);
  if (filters.tag) params.append("tag", filters.tag);

  const queryString = params.toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
  return request(endpoint);
}

export async function fetchProductById(id) {
  return request(`/products/${id}`);
}

export async function calculateOrderApi(items) {
  return request("/orders/calculate", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}

export async function submitWhatsappOrderApi(orderData) {
  return request("/orders/whatsapp", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}
