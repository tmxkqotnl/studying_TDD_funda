import request from "supertest";
import app, { test } from "../../server.js";
import newProduct from "../data/new-data.json";
import updatedProduct from "../data/updated-data.json";
import mongoose from "mongoose";
import { Key } from "../../Key.js";
import { expect } from "@jest/globals";

// to handle error that occurs when testing time is too short
beforeAll(async () => {
  await test();
  await mongoose.connect(Key, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});
afterAll(async () => {
  await mongoose.disconnect();
});

describe("POST /api/products", () => {
  // POST '/'
  it(`POST /api/products`, async () => {
    const response = await request(app).post("/api/products").send(newProduct);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toBe(newProduct.name);
    expect(response.body.description).toBe(newProduct.description);
    expect(response.body.price).toBe(newProduct.price);
  });

  // POST '/' ERROR
  it("should return 400 on POST /api/products", async () => {
    const response = await request(app).post("/api/products").send({
      name: "ABCD",
      price: 15,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual({
      message: "request is not correct",
    });
  });
});

describe("GET /api/products", () => {
  let rProduct;

  // GET all documents
  it("GET /api/products", async () => {
    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    expect(response.body[0].price).toBeDefined();

    // not recommended
    rProduct = response.body[0];
  });

  // GET by productId
  it("GET /api/products/:productId", async () => {
    const response = await request(app).get(`/api/products/${rProduct._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(rProduct.name);
    expect(response.body.price).toBe(rProduct.price);
    expect(response.body.description).toBe(rProduct.description);
  });

  // GET handling 404
  it("should return 404 on GET /api/products/:productId", async () => {
    const response = await request(app).get(
      `/api/products/60c9302af3cb5642e012bef5`
    );

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toStrictEqual("(GET) No product found");
  });
});

describe("Update /api/products", () => {
  let rProduct;
  beforeAll(async () => {
    const response = await request(app).get("/api/products");
    rProduct = response.body[0];
  });

  // PUT by id
  it("PUT /api/products/:productId", async () => {
    const response = await request(app)
      .put(`/api/products/${rProduct._id}`)
      .send(updatedProduct);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(updatedProduct.name);
    expect(response.body.description).toBe(updatedProduct.description);
    expect(response.body.price).toBe(updatedProduct.price);
  });

  // PUT handling 404
  it("should return 404 on PUT /api/products/:productId", async () => {
    const response = await request(app)
      .put(`/api/products/60c9302af3cb5642e012bef5`)
      .send();

    expect(response.statusCode).toBe(404);
  });
});

describe("Delete /api/products/:productId", () => {
  let rProduct;
  beforeAll(async () => {
    const response = await request(app).get("/api/products");
    rProduct = response.body[0];
  });

  // DEL by id
  it("DEL /api/products", async () => {
    const response = await request(app)
      .delete(`/api/products/${rProduct._id}`)
      .send();

    expect(response.statusCode).toBe(200);
  });

  // DEL handling 404
  it("should return 404 on DELETE /api/products/:productId", async () => {
    const response = await request(app)
      .delete(`/api/products/${rProduct._id}`)
      .send();

    expect(response.statusCode).toBe(404);
  });
});
