import Table from '../models/Table.js';

export const getTables = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const tables = await Table.find(query).sort({ number: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

export const getTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found',
      });
    }

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const createTable = async (req, res, next) => {
  try {
    const table = await Table.create(req.body);

    res.status(201).json({
      success: true,
      data: table,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Table number already exists',
      });
    }
    next(error);
  }
};

export const updateTable = async (req, res, next) => {
  try {
    let table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found',
      });
    }

    table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Table number already exists',
      });
    }
    next(error);
  }
};

export const updateTableStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['available', 'occupied', 'reserved'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status',
      });
    }

    let table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found',
      });
    }

    table.status = status;
    await table.save();

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        error: 'Table not found',
      });
    }

    await table.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

