import Item from './item.model.js';

export const createItem = async (data) => {
  const item = new Item(data);
  return await item.save();
};

export const getItemsByCollege = async (collegeId, query = {}) => {
  const filter = { collegeId, ...query };
  return await Item.find(filter).sort({ createdAt: -1 });
};

export const getItemById = async (id) => {
  return await Item.findById(id);
};

export const deleteItem = async (id) => {
  return await Item.findByIdAndDelete(id);
};

export const updateItemStatus = async (id, status) => {
  return await Item.findByIdAndUpdate(id, { status }, { new: true });
};
