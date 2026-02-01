// import emailjs from "@emailjs/nodejs";

// export const sendGreetingEmailBackend = async (clientData) => {
//   try {
//     return await emailjs.send(
//       process.env.EMAILJS_SERVICE_ID,
//       process.env.EMAILJS_TEMPLATE_ID,
//       {
//         name: clientData.name,
//         email: clientData.email,
//         message: clientData.message,
//         serviceUsed: clientData.serviceUsed || "our services",
//         occasion: clientData.occasion || "special occasion",
//       },
//       {
//         publicKey: process.env.EMAILJS_PUBLIC_KEY,
//         privateKey: process.env.EMAILJS_PRIVATE_KEY  // ← REQUIRED for Node.js [web:279]
//       }
//     );
//   } catch (error) {
//     console.error("Backend EmailJS error:", error);
//     throw error;
//   }
// };

// backend/src/services/email.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail
    pass: process.env.EMAIL_APP_PASS,  // 16-char app password
  },
});

export const sendGreetingEmailBackend = async (clientData) => {
  const { name, email, message, serviceUsed, occasion } = clientData;

  if (!email) {
    throw new Error("No email provided for backend send");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Greetings from Smart Taxi - ${occasion || "Thank you"}`,
    html: `
      <p>Hi ${name},</p>
      <p>${message}</p>
      <p><strong>Service:</strong> ${serviceUsed || "our services"}</p>
      <p><strong>Occasion:</strong> ${occasion || "special day"}</p>
      <br/>
      <p>Warm regards,<br/>Smart Taxi Team</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("📧 Nodemailer sent:", info.messageId);
  return info;
};


// import nodemailer from "nodemailer";
// 
// const transporter = nodemailer.createTransport({
  // service: "gmail",  // or "hotmail", "yahoo"
  // auth: {
    // user: process.env.EMAIL_USER,      // yourgmail@gmail.com
    // pass: process.env.EMAIL_PASS       // app password
  // }
// });
// 
// export const sendGreetingEmailBackend = async (clientData) => {
  // const mailOptions = {
    // from: process.env.EMAIL_USER,
    // to: clientData.email,
    // subject: `Greeting from Smart Taxi - ${clientData.occasion}`,
    // html: `
      // <h2>Hi ${clientData.name}!</h2>
      // <p>${clientData.message}</p>
      // <p>Service: ${clientData.serviceUsed}</p>
      // <p>Occasion: ${clientData.occasion}</p>
      // <hr>
      // <small>Smart Taxi Team</small>
    // `
  // };
// 
  // return transporter.sendMail(mailOptions);
// };
// 
