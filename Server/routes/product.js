const router = require("express").Router();
const ctrls = require("../controllers/product");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");
const uploader = require("../config/cloudinary_config.js");

router.post(
  "/",
  [verifyAccessToken, isAdmin],
  uploader.fields([{ name: "images", maxCount: 10 }]),
  ctrls.createProduct
);
router.get("/", ctrls.getAllProduct);
router.put("/ratings", [verifyAccessToken], ctrls.ratings);

router.put(
  "/uploadimage/:pid",
  [verifyAccessToken, isAdmin],
  uploader.array("image", 10),
  ctrls.uploadimagesProduct
);

router.put(
  "/variant/:pid",
  [verifyAccessToken, isAdmin],
  uploader.fields([{ name: "images", maxCount: 10 }]),
  ctrls.addVariant
);

router.put(
  "/:pid",
  [verifyAccessToken, isAdmin],
  uploader.fields([{ name: "images", maxCount: 10 }]),
  ctrls.updateProduct
);

router.delete("/:pid", [verifyAccessToken, isAdmin], ctrls.deleteProduct);
router.get("/:pid", ctrls.getProduct);

module.exports = router;
