const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, isAdmin, phone, address, city, avatar } = newUser;

    try {
      const checkUser = await User.findOne({
        email: email, //tìm email đã tông tại trong db chưa?
      });

      if (checkUser !== null) {
        resolve({
          status: "ERROR-EMAIL",
          message: "Email đã tồn tại",
        });
      }

      // Tạo mã hóa cho mật khẩu
      const hash = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
        isAdmin,
        phone,
        address,
        city,
        avatar,
      });

      if (createdUser) {
        resolve({
          status: "OK",
          message: "Tạo tài khoản thành công.",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email, //tìm email đã tông tại trong db chưa?
      });

      if (checkUser === null) {
        resolve({
          status: "ERROR-EMAIL",
          message: "Email không tồn tại",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERROR-PASSWORD",
          message: "Mật khẩu không đúng! Vui lòng kiểm tra lại.",
        });
      }

      const access_token = await genneralAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });

      resolve({
        status: "OK",
        message: "Đăng nhập thành công!",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUserId = await User.findOne({
        _id: id, //tìm email đã tông tại trong db chưa?
      });

      if (checkUserId === null) {
        resolve({
          status: "ERR",
          message: "Email (User) này không tồn tại!",
        });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "Update user success",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUserId = await User.findOne({
        _id: id, //tìm email đã tông tại trong db chưa?
      });

      if (checkUserId === null) {
        resolve({
          status: "ERR",
          message: "Email (User) này không tồn tại!",
        });
      }

      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();

      resolve({
        status: "OK",
        message: "All user success",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id, //tìm email đã tông tại trong db chưa?
      });

      if (user === null) {
        resolve({
          status: "ERR",
          message: "Email (User) này không tồn tại!",
        });
      }

      resolve({
        status: "OK",
        message: "Get detail success",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  deleteManyUser,
  getAllUser,
  getDetailUser,
};
