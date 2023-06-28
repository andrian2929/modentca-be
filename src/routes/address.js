const { Router } = require("express");
const {
  getProvince,
  getCity,
  getDistrict,
  getSubDistrict,
} = require("../controllers/addressController");

const router = Router();

router.get("/provinces", getProvince);
router.get("/province/:provinceId/cities/", getCity);
router.get("/city/:cityId/districts", getDistrict);
router.get("/district/:districtId/sub-districts", getSubDistrict);

module.exports = router;
