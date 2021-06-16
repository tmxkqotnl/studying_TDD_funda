/*
  controller for product router
  that handles CRUD of model product
*/

import Product from "../models/Product";
import { isValidObjectId } from "mongoose";

// create document
const createProduct = async (req, res, next) => {
  try {
    const createdProduct = await Product.create(req.body);
    res.status(201).json(createdProduct);
  } catch (error) {
    next(error);
  }
};

// get all documents
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// get documents by id
const getProductById = async (req, res, next) => {
  try {
    const gData = await Product.findById(req.params.productId);
    if (gData === null) {
      return res.status(404).json({ message: "(GET) No product found" });
    }
    res.status(200).json(gData);
  } catch (error) {
    next(error);
  }
};

// update document by id
const updateProduct = async (req, res, next) => {
  try {
    const response = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      {
        new: true,
      }
    );
    if (response === null) {
      return res.status(404).json({
        message: "(UPDATE) No product found",
      });
    }
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// delete document by id
const deleteProduct = async (req, res, next) => {
  try {
    const response = await Product.findByIdAndDelete(req.params.productId);
    if (response === null) {
      return res.status(404).json({ message: "(DELETE) No product found" });
    }

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const validateRequest = (req, res, next) => {
  const { name, description, price } = req.body;
  const message = "request is not correct";

  if (typeof name !== "string" || !name || name.toString().length === 0) {
    return res.status(400).json({
      message,
    });
  }
  if (!description) {
    return res.status(400).json({
      message,
    });
  }
  if (description && description.toString().length === 0) {
    return res.status(400).json({
      message,
    });
  }

  if (!price || typeof price !== "number" || price <= 0) {
    return res.status(400).json({
      message,
    });
  }
  next();
};

const validateObjectId = (req, res, next) => {
  if (!isValidObjectId(req.params.productId) || !req.params.producId) {
    return res.status(400).json({
      message: "invalid product ID",
    });
  }

  next();
};

export default {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  validateRequest,
  validateObjectId,
};
