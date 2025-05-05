const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Fish = require('./models/Fish');
const multer = require('multer');
const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const upload = multer({ dest: 'uploads/' });

app.post('/fish', upload.fields([{ name: 'qrImage' }, { name: 'fishImage' }]), async (req, res) => {
  try {
    const { fishName, placeOfCatch, catchLocation } = req.body;

    const qrResult = await cloudinary.uploader.upload(req.files.qrImage[0].path);
    const fishResult = await cloudinary.uploader.upload(req.files.fishImage[0].path);

    fs.unlinkSync(req.files.qrImage[0].path);
    fs.unlinkSync(req.files.fishImage[0].path);

    const fish = new Fish({
      fishName,
      placeOfCatch,
      catchLocation,
      qrImageUrl: qrResult.secure_url,
      fishImageUrl: fishResult.secure_url,
    });

    await fish.save();
    res.json({ message: 'Fish uploaded', fish });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/fish', async (req, res) => {
  const data = await Fish.find().sort({ uploadedAt: -1 });
  res.json(data);
});

app.delete('/fish/:id', async (req, res) => {
  await Fish.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.put('/fish/:id', async (req, res) => {
  const { fishName, placeOfCatch, catchLocation } = req.body;
  const updated = await Fish.findByIdAndUpdate(
    req.params.id,
    { fishName, placeOfCatch, catchLocation },
    { new: true }
  );
  res.json(updated);
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
