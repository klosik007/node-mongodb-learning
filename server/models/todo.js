var mongoose = require('mongoose');

var Todo = mongoose.model('todo2', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

module.exports = {Todo};