const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Joi = require("joi");
const Goal = require("../models/goalModel");

// @desc    Get all goals
// @route   GET /api/goals
// @access  Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find();
  res.status(200).json(goals);
});

// @desc    Create a goal
// @route   POST /api/goals
// @access  Private
const setGoal = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(1000).required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send({
      error: validationResult.error.details[0].message,
    });
  }

  const goal = await Goal.create({
    name: req.body.name,
  });

  res.status(201).json({ message: "Goal created successfully!", goal });
});

// @desc    Update a goal
// @route   PUT /api/goals/:id
// @access  Private
const updateGoal = asyncHandler(async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(1000).required(),
  });

  const validationResult = schema.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send({
      error: validationResult.error.details[0].message,
    });
  }

  // Check if ID format is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "Goal not found!",
    });
  }

  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    return res.status(400).json({ message: `Goal not found!` });
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res
    .status(201)
    .json({ message: "Goal updated successfully!", goal: updatedGoal });
});

// @desc    Delete a goal
// @route   DELETE /api/goals/:id
// @access  Private
const deleteGoal = asyncHandler(async (req, res) => {
  // Check if ID format is valid
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      message: "Goal not found!",
    });
  }

  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    return res.status(400).json({ message: `Goal not found!` });
  }

  await goal.deleteOne();

  res
    .status(200)
    .json({ message: `Goal deleted successfully!`, id: req.params.id });
});

module.exports = { getGoals, setGoal, updateGoal, deleteGoal };
