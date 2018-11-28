var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    title: {type: String, lowercase: true, unique: true, minlength: 5, maxlength: 250},
    author: String,
    category: String,
    hashtags: String,
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    body: String,
    comments: [{nick: String, body: String, date: Date}],
});

noteSchema.set()

var Notebook = mongoose.model('Notebook', noteSchema);

var note1 = new Notebook({
    title: 'First Note',
    author: 'Przemek Klos',
    category: 'Lifestyle',
    hashtags: '#life #is #hard',
    date: new Date(),
    hidden: false,
    body: 'body',
    comments: []
});

noteSchema.virtual('showBody').
get(function() {return this.body;});

console.log(note1.showBody);

Notebook.findOne();