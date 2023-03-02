const { Router } = require("express");
const anoController = require("../controllers/anoController.js");
const checkToken = require("../middlewares/checkToken.js");

const router = Router();

router.post("/ano/create", checkToken, anoController.create);
router.put("/ano/update", checkToken, anoController.update);
router.get("/ano/getall", anoController.getAll);
router.delete("/ano/delete", checkToken, anoController.delete);

module.exports = router;
