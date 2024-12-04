const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// MongoDB setup
mongoose.connect('mongodb+srv://jananisuresh1233:janani123@cluster0.p4ztb.mongodb.net/student_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();
const port = 3001;

// Middleware
app.use(express.static('public'));  // Serve static files from 'public' folder
app.use(bodyParser.json());  // To parse JSON data from frontend

// MongoDB Schema and Model
const studentSchema = new mongoose.Schema({
    name: String,
    rollNo: String,
    marks1: Number,
    marks2: Number,
    marks3: Number,
    marks4: Number,
    percentage: Number
});

const Student = mongoose.model('Student', studentSchema);

// Routes
app.get('/get-students', async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

app.get('/get-student/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.json(student);
});

app.post('/add-student', async (req, res) => {
    const { name, rollNo, marks1, marks2, marks3, marks4, percentage } = req.body;
    const newStudent = new Student({
        name,
        rollNo,
        marks1,
        marks2,
        marks3,
        marks4,
        percentage
    });
    await newStudent.save();
    res.status(200).send('Student added successfully');
});

app.put('/update-student', async (req, res) => {
    const { id, name, rollNo, marks1, marks2, marks3, marks4, percentage } = req.body;
    await Student.findByIdAndUpdate(id, {
        name,
        rollNo,
        marks1,
        marks2,
        marks3,
        marks4,
        percentage
    });
    res.status(200).send('Student updated successfully');
});

app.delete('/delete-student/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.status(200).send('Student deleted successfully');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
