import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	priority: { type: String, required: true },
	dueDate: Date,
	isCompleted: { type: Boolean, required: true },
});

taskSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

taskSchema.set('toJSON', { virtuals: true });

export const Task = mongoose.model('Task', taskSchema);
