export const adminRegisterController = async (req, res) => {
  try {
    console.log("AdminRegisterController called with body:", req.body);
    console.log("AdminRegisterController called with files:", req.files);
  } catch (error) {
    console.error("AdminRegisterController error:", error);
  }
};
