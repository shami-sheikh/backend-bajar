const errorMiddlewere = (error, req, res, next) => {
  console.log("Error name", error.name);
  if (error.name === "ZodError") {
    res.status(400).json({
      message: "Validation failed",
      extraDetails: error.errors[0].message,
    });
    const status = error.status || 500;
    const message = error.message || "Backend error";
    const extraDetails = error.extraDetails || "Something went wrong";
    re;
  }
   return res.status(status).json({ message, extraDetails })
};
module.exports=errorMiddlewere;
