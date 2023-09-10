const Product = require("../models/ProductModel");
const bcrypt = require("bcrypt");

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description, discount, selled } = newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name, //tìm name đã tồn tại trong db chưa?
      });

      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "Tên sản phẩm đã tồn tại",
        });
      }

      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount,
        selled,
      });

      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProductId = await Product.findOne({
        _id: id, //tìm id đã tồn tại trong db chưa?
      });

      if (checkProductId === null) {
        resolve({
          status: "ERR",
          message: "Sản phẩm này không tồn tại!",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "Update Product success",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id, //tìm id product đã tồn tại trong db chưa?
      });

      if (product === null) {
        resolve({
          status: "ERR",
          message: "Sản phẩm này không tồn tại!",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail Product success",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.count();
      let allProduct = [];

      if (filter) {
        const label = filter[0];

        const allProductFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);

        resolve({
          status: "OK",
          message: "All product filter success",
          data: allProductFilter,
          totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }

      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];

        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        resolve({
          status: "OK",
          message: "All product sort success",
          data: allProductSort,
          totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }

      if (!limit) {
        allProduct = await Product.find();
      } else {
        allProduct = await Product.find()
          .limit(limit)
          .skip(page * limit);
      }

      resolve({
        status: "OK",
        message: "All product success",
        data: allProduct,
        totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllTypeProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTypeProduct = await Product.distinct("type");

      resolve({
        status: "OK",
        message: "All type product success",
        data: allTypeProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProductId = await Product.findOne({
        _id: id, //tìm email đã tồn tại trong db chưa?
      });

      if (checkProductId === null) {
        resolve({
          status: "ERR",
          message: "Sản phẩm này không tồn tại!",
        });
      }

      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  getAllProduct,
  getAllTypeProduct,
  deleteProduct,
  deleteManyProduct,
};
