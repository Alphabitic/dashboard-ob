import express from "express";

import {
createProperty,
deleteProperty,
getAllProperties,
getPropertyDetail,
updateProperty,
} from "../controllers/property.controller.js";

const router = express.Router();

router.get("/", getAllProperties);
router.get("/:id", getPropertyDetail);
router.post("/", createProperty);
router.patch("/:id", updateProperty);
router.delete("/:id", deleteProperty);

export default router;