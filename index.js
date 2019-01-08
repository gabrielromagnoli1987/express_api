const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

let courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    // to access the path variables
    console.log(req.params.id);
    // to access query param variables
    console.log(req.query);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (! course) {
        return res.status(404).send(`The course with id: ${req.params.id} doesn't exist`);
    }
    res.send(course);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (! course) {
        return res.status(404).send(`The course with id: ${req.params.id} doesn't exist`);
    }
    const { error } = validateCourse(req.body); // object destructuring sintax - same as result.error
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    course.name = req.body.name;
    res.send(course);

});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (! course) {
        return res.status(404).send(`The course with id: ${req.params.id} doesn't exist`);
    }
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.status(204).send();
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(course, schema);
}

// reading from a env property
// export PORT=5000 (on the terminal)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));