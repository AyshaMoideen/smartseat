const express = require("express");

const router = express.Router();

const {
    addBatch,
    getBatches,
    updateBatch,
    deleteBatch
} = require("../controllers/batchController");

const protect = require("../middleware/authMiddleware");

/* ==========================================
   PROTECT ALL BATCH ROUTES
========================================== */

router.use(protect);


/* ==========================================
   ADD BATCH
   POST /api/batches
========================================== */

router.post("/", addBatch);


/* ==========================================
   GET ALL BATCHES
   GET /api/batches
========================================== */

router.get("/", getBatches);


/* ==========================================
   UPDATE BATCH
   PUT /api/batches/:id
========================================== */

router.put("/:id", updateBatch);


/* ==========================================
   DELETE BATCH
   DELETE /api/batches/:id
========================================== */

router.delete("/:id", deleteBatch);


module.exports = router;