const router = require("express").Router();
const elementManager = require("../manager/elementManager");
const { getErrorMessage } = require("../utils/errorHelper");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/create", isAuth, (req, res) => {
  res.render("element/create");
});

router.post("/create", isAuth, async (req, res) => {
  const elementData = req.body;
  elementData["owner"] = req.user.id;

  try {
    await elementManager.create(elementData);
    res.redirect("/element/catalog");
  } catch (err) {
    res.render("element/create", { error: getErrorMessage(err) });
  }
});

router.get("/catalog", async (req, res) => {
  try {
    const elements = await elementManager.getAll();
    res.render("element/catalog", { elements });
  } catch (err) {
    res.render("element/catalog", { error: getErrorMessage(err) });
  }
});

router.get("/:id/details", async (req, res) => {
  const elementId = req.params.id;

  try {
    const element = await elementManager.getOne(elementId);
    const isOwner = element.owner._id.toString() === req.user?.id;
    const isActed = element.buyingList.some((x) => x._id == req.user?.id);

    res.render("element/details", { element, isOwner, isActed });
  } catch (err) {
    res.render("404", { error: getErrorMessage(err) });
  }
});

router.get("/:id/edit", isAuth, async (req, res) => {
  const elementId = req.params.id;

  try {
    const elementData = await elementManager.getOne(elementId);
    res.render("element/edit", { elementData });
  } catch (err) {
    res.render("404", { error: getErrorMessage(err) });
  }
});

router.post("/:id/edit", isAuth, async (req, res) => {
  const elementId = req.params.id;
  const elementData = req.body;

  try {
    await elementManager.update(elementId, elementData);
    res.redirect(`/element/${elementId}/details`);
  } catch (err) {
    res.render("element/edit", { elementData, error: getErrorMessage(err) });
  }
});

router.get("/:id/delete", isAuth, async (req, res) => {
  //check for id !!!
  const elementId = req.params.id;
  try {
    await elementManager.delete(elementId);
    res.redirect("/element/catalog");
  } catch (err) {
    res.render("404", { error: getErrorMessage(err) });
  }
});

router.get("/:id/buy", isAuth, async (req, res) => {
  const elementId = req.params.id;
  const userId = req.user.id;

  try {
    await elementManager.action(elementId, userId);
    res.redirect(`/element/${elementId}/details`);
  } catch (err) {
    res.render(`404`, { error: getErrorMessage(err) });
  }
});

router.get("/search", isAuth, (req, res) => {
  res.render("search");
});

router.post("/search", isAuth, async (req, res) => {
  const { searchName, searchType } = req.body;
  const searchedData = await elementManager.getAllSearched(
    searchName,
    searchType
  );
  res.render("search", { searchedData });
});
module.exports = router;
