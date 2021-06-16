import productController from "../../controllers/products";
import Product from "../../models/Product";
import httpMocks from "node-mocks-http";
import newProduct from "../data/new-data.json";
import allProducts from "../data/all-products.json";
import updatedProduct from "../data/updated-data.json";
import deletedProduct from "../data/deleted-product.json";
import validationData from "../data/validation-data.json";
import { expect } from "@jest/globals";

Product.create = jest.fn();
Product.find = jest.fn();
Product.findById = jest.fn();
Product.findByIdAndUpdate = jest.fn();
Product.findByIdAndDelete = jest.fn();

let req;
let res;
let next;
const productId = "60c9302af3cb5642e012bef2"; // temp

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("Product Controller Create", () => {
  beforeEach(() => {
    req.body = newProduct;
  });
  it("should have a createProduct function", () => {
    expect(typeof productController.createProduct).toBe("function");
  });
  it("should call ProductModel.create", async () => {
    await productController.createProduct(req, res, next);

    expect(Product.create).toBeCalled();
    expect(Product.create).toBeCalledWith(newProduct);
  });
  it("should return 201 response code", async () => {
    await productController.createProduct(req, res, next);

    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    Product.create.mockReturnValue(newProduct);
    await productController.createProduct(req, res, next);

    expect(res._getJSONData()).toStrictEqual(newProduct);
  });
  it("should handle errors", async () => {
    const errorMessage = { message: "some properties are missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    Product.create.mockReturnValue(rejectedPromise);

    await productController.createProduct(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("Product Controller Get", () => {
  it("should have a getProducts", () => {
    expect(typeof productController.getProducts).toBe("function");
  });
  it("should call Product.find({})", async () => {
    await productController.getProducts(req, res, next);

    expect(Product.find).toBeCalled();
    expect(Product.find).toHaveBeenCalledWith({});
  });
  it("should return 200 response", async () => {
    await productController.getProducts(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    Product.find.mockReturnValue(allProducts);
    await productController.getProducts(req, res, next);

    expect(res._getJSONData()).toStrictEqual(allProducts);
  });
  it("should handle error", async () => {
    const errorMessage = { message: "Error while finding product data" };
    const rejectedPromise = Promise.reject(errorMessage);
    Product.find.mockReturnValue(rejectedPromise);
    await productController.getProducts(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller get by id", () => {
  it("should have a getProductById", () => {
    expect(typeof productController.getProductById).toBe("function");
  });
  it("should call Product.findById", async () => {
    req.params.productId = productId;
    await productController.getProductById(req, res, next);

    expect(Product.findById).toBeCalledWith(productId);
  });
  it("should return json and response code 200", async () => {
    Product.findById.mockReturnValue(newProduct);
    await productController.getProductById(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(newProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return 404 when item doesn't exist", async () => {
    Product.findById.mockReturnValue(null);
    await productController.getProductById(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle error", async () => {
    const errorMessage = { message: "No product found" };
    const rejectedPromise = Promise.reject(errorMessage);
    Product.findById.mockReturnValue(rejectedPromise);
    await productController.getProductById(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller update product", () => {
  it("should have an updateProduct", () => {
    expect(typeof productController.updateProduct).toBe("function");
  });
  it("should call Product.findByIdAndUpdate", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;
    await productController.updateProduct(req, res, next);

    expect(Product.findByIdAndUpdate).toBeCalled();
    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      productId,
      updatedProduct,
      { new: true }
    );
  });

  it("should return json body and response code 200", async () => {
    req.params.productId = productId;
    req.body = updatedProduct;
    Product.findByIdAndUpdate.mockReturnValue(updatedProduct);
    await productController.updateProduct(req, res, next);

    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(updatedProduct);
  });
  it("should handle 404 when product doesn't exist", async () => {
    Product.findByIdAndUpdate.mockReturnValue(null);
    await productController.updateProduct(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle Error", async () => {
    const errorMessage = { message: "Error while Updating product datum" };
    const rejectedPromise = Promise.reject(errorMessage);
    Product.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await productController.updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller delete product", () => {
  it("should have a deleteProduct function", () => {
    expect(typeof productController.deleteProduct).toBe("function");
  });
  it("should call Product.findByIdAndDelete", async () => {
    req.params.productId = productId;
    await productController.deleteProduct(req, res, next);

    expect(Product.findByIdAndDelete).toBeCalled();
    expect(Product.findByIdAndDelete).toBeCalledWith(productId);
  });
  it("should return json and status code 200", async () => {
    Product.findByIdAndDelete.mockReturnValue(deletedProduct);
    await productController.deleteProduct(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toStrictEqual(deletedProduct);
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return status code 404 when product doesn't exist", async () => {
    Product.findByIdAndDelete.mockReturnValue(null);
    await productController.deleteProduct(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._getJSONData()).toStrictEqual({
      message: "(DELETE) No product found",
    });
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should handle Errors", async () => {
    const errorMessage = { message: "Error while deleting product datum" };
    const rejectedPromise = Promise.reject(errorMessage);
    Product.findByIdAndUpdate.mockReturnValue(rejectedPromise);
    await productController.updateProduct(req, res, next);

    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

describe("Product Controller Validate", () => {
  it("should have a validateRequest", () => {
    expect(typeof productController.validateRequest).toBe("function");
  });
  it.each(validationData)(
    "should return 400 when request is not correct",
    ({ name, description, price }) => {
      req.body = { name, description, price };
      productController.validateRequest(req, res, next);

      expect(res.statusCode).toBe(400);
    }
  );
});

describe("Product Controller validata Object ID", () => {
  it("should have a validateRequest", () => {
    expect(typeof productController.validateObjectId).toBe("function");
  });
  it("should return status code 400 when product id is invalid", () => {
    req.params.productId = "asdokasdo1239u91";
    productController.validateObjectId(req, res, next);
    expect(res.statusCode).toBe(400);
  });
});
