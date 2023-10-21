const router = require("express").Router();
const userManager = require("../manager/userManager");
const { getErrorMessage } = require("../utils/errorHelper");
const { TOKEN_KEY } = require("../config/config");

router.get("/register", (req, res) => {
  res.render("user/register");
});

router.post("/register", async (req, res) => {
  const { email, userName, password, repeatPassword } = req.body;

  try {
    const token = await userManager.register({
      email,
      userName,
      password,
      repeatPassword,
    });
    res.cookie(TOKEN_KEY, token);
    res.redirect("/");
  } catch (err) {
    res.render("user/register", { error: getErrorMessage(err) });
  }
});

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await userManager.login(email, password);
    res.cookie(TOKEN_KEY, token);
    res.redirect("/");
  } catch (err) {
    res.render("user/login", { error: getErrorMessage(err) });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
