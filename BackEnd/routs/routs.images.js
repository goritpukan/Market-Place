const { Router } = require('express');
const User = require("../models/User.js");
const fs = require("fs");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Images/Avatars")
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E8)
    cb(null, filename + ".png")
  }
})
const upload = multer({ storage: storage });

const router = Router();

router.post("/changeAvatar:nickname", upload.single("Avatar"), async (req, res) => {
  try {
    const candidate = await User.findOne({ nickname: req.params.nickname });
    if (!candidate) {
      res.end({
        message: "Server Error",
        isError: true,
      });
      res.status(400);
    } else {
      candidate.$set({ avatar: req.file.filename });
      candidate.save((err, result) => {
        if (err) {
          res.end({
            message: "Server Error",
            isError: true,
          });
          res.status(400);
        } else {
          res.send({
            message: "Avarat is updated",
            isError: false,
          });
          res.status(200);
        }
      });
    }

  } catch (e) {
    res.send({
      message: "Server Error",
      isError: true,
    });
  }

});

router.get("/avatar/:ImageName", async (req, res) => {
  try {
    const { ImageName } = req.params;

    fs.readFile("./Images/Avatars/" + ImageName, (err, content) => {
      if (err) {
        res.end(err.message);
      } else {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(content);
        return;
      }
    })
  } catch (e) {
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
});

router.get("/ProductImage/:ImageName", async (req, res) => {
  try {
    const { ImageName } = req.params;

    fs.readFile("./Images/ProductPhotos/" + ImageName, (err, content) => {
      if (err) {
        fs.readFile("./Images/ProductPhotos/DefaultIcon.png", (err, content) => {
          if (!err) {
            res.writeHead(200, { "Content-Type": "image/png" });
            res.end(content);
            return;
          }
        })
      } else {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(content);
        return;
      }
    })
  } catch (e) {
    res.send({
      message: "Server Error",
      isError: true,
    });
  }
});


module.exports = router;

