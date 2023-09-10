const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmailCreateOrder = async (email, orderItems) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  let listItem = "";
  const attachImage = [];

  orderItems.forEach((order) => {
    listItem += `<div>
        <div>
            Tên sản phẩm: <b>${order.name}</b>
        </div>
        <div>
            Số lượng: <b>${order.amount}</b></b>
        </div>
        <div>
            Giá sản phẩm: <b>${order.price * order.amount} VND</b>
        </div>
        <div>Bên dưới là hình ảnh của sản phẩm</div>
    </div>`;

    attachImage.push({ path: order.image });
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: email, // list of receivers
    subject: "Shop ANHTUAN SHOP gửi thông báo.", // Subject line
    text: "Hello world?", // plain text body
    html: `<div>Bạn đã đặt hàng thành công tại shop <b style:'font-size: 1.2rem; color: red;'>ANHTUAN SHOP</b></div> ${listItem}`, // html body
    attachments: attachImage,
  });
};

module.exports = {
  sendEmailCreateOrder,
};
