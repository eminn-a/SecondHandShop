const Element = require("../models/Element");

exports.create = async (elementData) => Element.create(elementData);

exports.getAll = async () => Element.find().lean();

exports.getOne = async (id) => Element.findById(id).populate("owner").lean();

exports.delete = (id) => Element.findByIdAndDelete(id);

exports.update = (id, data) =>
  Element.findByIdAndUpdate(id, data, { runValidators: true, new: true });

exports.action = async (elementId, userId) => {
  const element = await Element.findById(elementId);
  const isActed = element.buyingList.some((x) => x?.toString() === userId);
  if (isActed) {
    return;
  }
  element.buyingList.push(userId);
  element.save();
};

exports.getAllSearched = async (name, type) => {
  let result = await Element.find().lean();
  //TODO: use mongoose to filter in the db
  if (name == "" && type == "") {
    return;
  }

  if (name) {
    result = result.filter((x) =>
      x.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (type) {
    result = result.filter((x) =>
      x.type.toLowerCase().includes(type.toLowerCase())
    );
  }

  return result;
};
