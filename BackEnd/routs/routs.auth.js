const { Router } = require('express');
const User = require("../models/User.js");

const router = Router();

router.post("/regisration", async (req, res) => {
  try {
    const { nickname, email, password } = req.body;

    const emailCandidate = await User.findOne({ email: email });
    const nicknameCandidate = await User.findOne({ nickname });
    if (emailCandidate && emailCandidate.email === email) {
      res.status(400);
      res.send({
        message: "Почта: " + emailCandidate.email + " уже занята!",
        isError: true
      });
      return;
    } else if (nicknameCandidate && nicknameCandidate.nickname === nickname) {
      res.status(400);
      res.send({
        message: "Ник: " + nicknameCandidate.nickname + " уже занят",
        isError: true
      });
      return;
    }

    const user = new User({
      nickname: nickname,
      email: email,
      password: password
    });

    await user.save((err, result) => {
      if (err) {
        console.log("Failed to save user, error: " + err);
        res.send(({
          message: "Failed to register",
          isError: true
        }));
        res.status(400);
        return;
      } else {
        res.send({
          message: result,
          isError: false
        });
      }
    });
    res.status(200);
  } catch (e) {
    console.log(e.message);
    res.send({
      message: "Server Error",
      isError: true
    });
  }

});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const candidate = await User.findOne({ email: email });
    if (!candidate) {
      res.send({
        message: "Нет аккаунта с такой почтой",
        isError: true
      });
      res.status(400);
    } else if (candidate.password !== password) {
      res.send({
        message: "Пароль неправильный",
        isError: true
      });
      res.status(400);
    } else {
      res.send({
        message: candidate,
        isError: false
      });
      res.status(200);
    }

  } catch (e) {
    console.log(e.message);
    res.send({
      message: "Server Error",
      isError: true
    });
  }
});

router.post("/ChangeName", async (req, res) => {
  try {
    const { nickname, newnickname } = req.body;
    const candidate = await User.findOne({ nickname: nickname });
    const CheckName = await User.findOne({nickname: newnickname});
    if(CheckName){
      es.send({
        message: "This NickName is Used Already",
        isError: true
      });
      return;
    }
    if (candidate) {
      candidate.$set({ nickname: newnickname });
      candidate.save((err, result) => {
        if (err) {
          res.send({
            message: "Server Error",
            isError: true
          });
          return;
        }
      });
      res.send({
        message: "Nickname changed",
        isError: false
      });
    } else {
      res.send({
        message: "Server Error",
        isError: true
      });
    }
  } catch (e) {
    console.log(e.message);
    res.send({
      message: "Server Error",
      isError: true
    });
  }
});

router.post("/ChangeEmail", async (req, res) => {
  try {
    const { password, email, newemail } = req.body;
    const candidate = await User.findOne({ email: email });
    if (candidate) {
      if (candidate.password === password) {
        candidate.$set({ email: newemail });
        candidate.save((err, result) => {
          if (err) {
            res.send({
              message: "Server Error1",
              isError: true
            });
            return;
          } else {
            res.send({
              message: "Email changed",
              isError: false
            });
          }
        });

      } else {
        res.send({
          message: "Пароль неправильный",
          isError: true
        });
      }
    } else {
      res.send({
        message: "Server Error",
        isError: true
      });
    }
  } catch (e) {
    console.log(e.message);
    res.send({
      message: "Server Error",
      isError: true
    });
  }
});

module.exports = router;


