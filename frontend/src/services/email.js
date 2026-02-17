import emailjs from "@emailjs/browser";

export const sendGreetingEmail = (clientData) => {
  /*const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  console.log("EmailJS params:", { publicKey, serviceId, templateId });  // ADD THIS

  if (!publicKey || !serviceId || !templateId) {
    throw new Error("Missing EmailJS config in .env.local");
  }*/

  return emailjs.send(
    //serviceId,
    //templateId,
    "service_w2f18mq",
    "template_2gnkt8h",
    {
      name: clientData.name,
      email: clientData.email,
      message: clientData.message,
      serviceUsed: clientData.serviceUsed,
      occasion: clientData.occasion,
    },
    "okc42lqGHarYj-WBQ"
    //publicKey  // ← PASS PUBLIC KEY AS 4th ARGUMENT [web:206]
  );
};
