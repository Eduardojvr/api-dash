"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chartsController_1 = require("../controller/chartsController");
const validateRequest_1 = require("../middleware/validateRequest");
const router = (0, express_1.Router)();
router.get('/', validateRequest_1.validateChartRequest, chartsController_1.getChart);
exports.default = router;
