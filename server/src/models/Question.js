import mongoose from 'mongoose';

const optionValidation = [
  {
    validator: (value) => Array.isArray(value) && value.length === 4,
    message: 'Each question must contain exactly four options.',
  },
];

const questionSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: optionValidation,
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Question', questionSchema);

