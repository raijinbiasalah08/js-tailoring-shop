const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

let products = [
  { id: 1, name: 'Pantalon', price: 450, image: 'https://i.pinimg.com/originals/c4/aa/cb/c4aacb3135856c9be89e6d9af24868d6.jpg' },
  { id: 2, name: 'Dress', price: 300, image: 'https://thumbs.dreamstime.com/b/elegant-formal-gown-dress-310463490.jpg' },
  { id: 3, name: 'Student Uniform', price: 1200, image: 'https://jhs.addu.edu.ph/wp-content/uploads/2023/08/2.png' },
  { id: 4, name: 'Formal Outfit', price: 1500, image: 'https://reenasidhu.com/wp-content/uploads/2023/09/Unveiling-the-Elegance.jpg' },
  { id: 5, name: 'Sofa Cover', price: 12000, image: 'https://i.ytimg.com/vi/pAk3P9QpZ04/maxresdefault.jpg' },
  { id: 6, name: 'Kurtina', price: 150, image: 'https://tse1.mm.bing.net/th/id/OIP.bEYPCjLcx8Qzy3o4XfK15gHaHg' }
];
let nextId = 7;

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    id: nextId++,
    name: req.body.name,
    price: Number(req.body.price),
    image: req.body.image
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
  console.log('Nadagdag:', newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;

  const editID = products.findIndex((p) => p.id === Number(id));

  if (editID === -1) {
    return res.status(404).json({ error: 'Hindi nahanap ang produkto' });
  }

  products[editID] = {
    id: Number(id),
    name: req.body.name,
    price: Number(req.body.price),
    image: req.body.image
  };

  res.json(products[editID]);
  console.log('Binago:', products[editID]);
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== Number(id));
  res.json({ message: 'Deleted', id: Number(id) });
  console.log('Natanggal ang id:', Number(id));
});


let users = [];
let nextUserId = 1;

app.post('/api/register', (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Kulang ang impormasyon' });
  }
  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: 'Ginagamit na ang username' });
  }
  const user = { id: nextUserId++, name, username, password };
  users.push(user);
  console.log('Nag-register:', username);
  res.status(201).json({ id: user.id, name: user.name, username: user.username });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Mali ang username o password' });
  }
  console.log('Nag-login:', username);
  res.json({ id: user.id, name: user.name, username: user.username });
});

let reservations = [];
let nextReservationId = 1;


app.get('/api/reservations', (req, res) => {
  res.json(reservations);
});


app.get('/api/reservations/:userId', (req, res) => {
  const mine = reservations.filter(
    (r) => String(r.userId) === String(req.params.userId)
  );
  res.json(mine);
});


app.post('/api/reservations', (req, res) => {
  const newReservation = {
    id: nextReservationId++,
    userId: req.body.userId,
    customerName: req.body.customerName,
    contact: req.body.contact,
    service: req.body.service,
    details: req.body.details,
    date: req.body.date,
    status: 'Pending'
  };
  reservations.push(newReservation);
  console.log('Bagong reservation:', newReservation);
  res.status(201).json(newReservation);
});


app.put('/api/reservations/:id/status', (req, res) => {
  const id = Number(req.params.id);
  const index = reservations.findIndex((r) => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Hindi nahanap ang reservation' });
  }
  reservations[index].status = req.body.status;
  console.log('Status binago:', reservations[index]);
  res.json(reservations[index]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT}`);
});
