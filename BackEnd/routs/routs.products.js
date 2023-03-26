const { Router } = require('express');
const Product = require("../models/ProductModel.js");
const router = Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images/ProductPhotos")
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E8)
    cb(null, filename + ".png")
  }
})
const upload = multer({ storage: storage });

router.post("/CreateProduct", async (req, res) => {
  try {
    req.body.owner = JSON.stringify(req.body.owner);
    const product = new Product(req.body);
    await product.save(((err, result) => {
      if (err) {
        res.send(({
          message: "Failed to Create",
          isError: true
        }));
        res.end(400);
      } else {
        res.send(({
          id: product.id,
          message: "Product Created",
          isError: false
        }));
      }
    }));
  } catch (e) {
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
})

router.post("/UploadProductImage:id", upload.array("Images", 10), async (req, res) => {
  try {
    const filenames = [];
    for (let i in req.files) {
      filenames.push(req.files[i].filename)
    }
    const candidate = await Product.findById(req.params.id);

    candidate.set({ photos: JSON.stringify(filenames) });

    await candidate.save(((err, result) => {
      if (err) {
        res.send(({
          message: "Failed to Save",
          isError: true
        }));
        res.end(400);
      } else {
        res.send(({
          message: "Product Saved",
          isError: false
        }));
      }
    }));
  } catch (e) {
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
})

router.get("/GetProductbyOwnerID:id", async (req, res) => {
  try {
    const candidate = await Product.find({ ownerID: req.params.id });
    if (candidate) {
      res.send({
        message: candidate,
        isError: false,
      });
    }else{
      res.send({
        message: "Server Error",
        isError: true,
      });
    }
  } catch (e) {
    console.log(e);
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
});
router.get("GetProductbyId/:id", async (req, res) => {
  try {
    const candidate = await Product.find({ _id : req.params.id });
    if (candidate) {
      res.send({
        message: candidate,
        isError: false,
      });
    }else{
      res.send({
        message: "Server Error",
        isError: true,
      });
    }
  } catch (e) {
    console.log(e);
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
});
module.exports = router;