import * as itemService from './item.service.js';

export const createItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      userId: req.user.userId,
      collegeId: req.user.collegeId,
    };
    const item = await itemService.createItem(itemData);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const { q, location, type, userId } = req.query;
    const query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ];
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (type) {
      query.type = type;
    }
    if (userId) {
      query.userId = userId;
    }

    const items = await itemService.getItemsByCollege(req.user.collegeId, query);

    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getItemById = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (item.collegeId.toString() !== req.user.collegeId) {
      return res.status(403).json({ success: false, message: 'Access denied: Different college' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (item.collegeId.toString() !== req.user.collegeId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Not the owner' });
    }
    await itemService.deleteItem(req.params.id);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const item = await itemService.getItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    if (item.collegeId.toString() !== req.user.collegeId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (item.userId.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Not the owner' });
    }
    const updatedItem = await itemService.updateItemStatus(req.params.id, req.body.status || 'resolved');

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
