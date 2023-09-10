const Order = require("../models/OrderProduct");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      user,
      email,
      fullName,
      address,
      city,
      phone,
      isPaid,
      paidAt,
    } = newOrder;

    try {
      const promises = orderItems?.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order?.product, // tìm kiếm và lấy cái 'id product' bằng với cái 'id product' trong orderItems
            countInStock: { $gte: order?.amount }, // tìm 'id product' trên để check số lượng còn bao nhiêu để cho phép giảm khi mua
          },
          {
            $inc: {
              countInStock: -order?.amount,
              selled: +order?.amount,
            },
          },
          {
            new: true, // Trả về số lượng mới nhất
          }
        );

        if (productData) {
          // nếu id product đó có đủ số lượng đặt hàng thì
          return {
            status: "OK",
            message: "SUCCESS ORDER",
          };
        } else {
          // nếu ko đủ số lượng đặt hàng thì
          return {
            status: "OK",
            message: "ERR",
            id: order?.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);

      if (newData.length) {
        const arrId = [];
        newData.forEach((item) => {
          arrId.push(item.id);
        });
        resolve({
          status: "ERR",
          message: `Sản phẩm với id: ${arrId.join(",")} không đủ hàng để mua`,
        });
      } else {
        const createdOrder = await Order.create({
          orderItems,
          shippingAddress: {
            fullName,
            address,
            city,
            phone,
          },
          paymentMethod,
          itemsPrice,
          shippingPrice,
          totalPrice,
          user,
          isPaid,
          paidAt,
        });

        if (createdOrder) {
          // await EmailService.sendEmailCreateOrder(email, orderItems); // gửi email đặt hàng thành công

          resolve({
            status: "OK",
            message: "Mua sản phẩm thành công .............",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id, //tìm id product đã tồn tại trong db chưa?
      }).sort({ createdAt: -1, updatedAt: -1 }); // sắp xếp lên đầu khi tạo mới 1 order

      if (order === null) {
        resolve({
          status: "ERR",
          message: "Sản phẩm này không tồn tại!",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail Oroduct Success",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id, //tìm id order đã tồn tại trong db chưa?
      });

      if (order === null) {
        resolve({
          status: "ERR",
          message: "Sản phẩm này không tồn tại!",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail Order Success kk...",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelOrderDetails = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data?.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order?.product, // tìm kiếm và lấy cái 'id product' bằng với cái 'id product' trong orderItems
            selled: { $gte: order?.amount }, // tìm 'id product' trên để check số lượng còn bao nhiêu để cho phép giảm khi mua
          },
          {
            $inc: {
              countInStock: +order?.amount,
              selled: -order?.amount,
            },
          },
          {
            new: true, // Trả về số lượng mới nhất
          }
        );

        if (productData) {
          order = await Order.findByIdAndDelete(id);

          if (order === null) {
            resolve({
              status: "ERR",
              message: "Sản phẩm này không tồn tại!",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order?.product,
          };
        }
      });

      const results = await Promise.all(promises);
      const newData = results && results[0] && results[0].id;

      if (newData) {
        resolve({
          status: "ERR",
          message: `Sản phẩm với id: ${newData.join(",")} không ton tai`,
        });
      }
      resolve({
        status: "OK",
        message: "Xoa thanh cong.............",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrder = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allOrder = await Order.find();

      resolve({
        status: "OK",
        message: "All order success",
        data: allOrder,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
};
