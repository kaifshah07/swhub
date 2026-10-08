 const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existingScript =
      document.getElementById("razorpay-sdk");

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.id = "razorpay-sdk";

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export default loadRazorpay;