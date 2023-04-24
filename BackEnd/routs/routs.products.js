const { Router } = require('express');
const Product = require("../models/ProductModel.js");
const User = require("../models/User.js");
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



router.post("/GetProducts", async (req, res) => {
  try {
    const { city, currency, category, minPrice, maxPrice, name, page } = req.body;
    const Query = {
      name: {$regex : new RegExp(name , "i")}, 
      city: city,
      currency: currency,
      category: category,
      cost: { $gt: minPrice, $lt: maxPrice }
    };

    if (!minPrice) {
      delete Query.cost["$gt"];
    }
    if (!maxPrice) {
      delete Query.cost["$lt"];
    }
    if(!name){
      delete Query.name;
    }
    for (let i in Query) {
      if (!Query[i]) {
        delete Query[i];
      }
    }
    if (Object.keys(Query.cost).length === 0) {
      delete Query.cost;
    }
    const ProductsLength = (await Product.find(Query)).length;
    const Products = await Product.find(Query).skip(page * 10).limit(10);
    if (Products.length >= 1) {
      res.send({
        message: Products,
        length: ProductsLength,
        isError: false
      });
    } else {
      res.send({
        message: "Nothing Found",
        isError: true
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400);
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
    } else {
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



router.get("/GetProductbyId/:id", async (req, res) => {
  try {
    const candidate = await Product.findById(req.params.id);
    if (candidate) {
      res.send({
        message: candidate,
        isError: false,
      });
    } else {
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

router.post("/DeleteProduct", async (req, res) => {
  try{
    const {ownerID, productID} = req.body;

    const owner = await User.findById(ownerID);
    const product = await Product.findById(productID);

    if(owner && product && owner.id === product.ownerID){
      product.delete();
      res.status(200);
      res.send({
        message: "UserDeleted",
        isError: false
      });
    }else{
      res.status(400);
      res.send({
        message: "Server Error",
        isError: true
      });
    }
  }catch (e){
    console.log(e);
    res.status(400);
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
});
module.exports = router;