import mongoose from 'mongoose';

const { Schema } = mongoose

interface ITodo {
    text: string,
    completed: boolean,
    completedAt: Date,
    _creator: mongoose.Schema.Types.ObjectId
}

const TodoSchema = new Schema<ITodo>({
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Date
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

const Todo = mongoose.model('todo', TodoSchema);

export { Todo };