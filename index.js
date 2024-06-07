const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

const protocol = 'http';
const host = 'example.com';
const port = 80;
const baseUrl = `${protocol}://${host}:${port}/api/persons`;

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  const currentTime = new Date();
  const entryCount = persons.length;
  
  response.send(`
    <p>Phonebook has info for ${entryCount} people</p>
    <p>${currentTime}</p>
  `);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const initialLength = persons.length;
  persons = persons.filter(person => person.id !== id);

  if (persons.length < initialLength) {
    response.status(204).end();
  } else {
    response.status(404).json({ error: 'Person not found' });
  }
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    });
  }

  const nameExists = persons.some(person => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = process.env.PORT || port;
app.listen(PORT, host, () => {
  console.log(`Server running at ${protocol}://${host}:${PORT}`);
});
