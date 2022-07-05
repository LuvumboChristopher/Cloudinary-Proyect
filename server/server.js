const { cloudinary } = require('./utils/cloudinary');
const express = require('express');
const app = express();
var cors = require('cors');

app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/api/images', async (req, res) => {
    const { resources } = await cloudinary.search
        .expression('folder:CloudinaryDemo')
        .sort_by('public_id', 'desc')
        .execute();

        console.log(resources)
    const publicIds = resources.map((file) => file.public_id);
    res.send(publicIds);
});


app.post('/api/upload', async (req, res) => {
    try {
        const selectedFile = req.body.img
        const uploadResponse = await cloudinary.uploader.upload(selectedFile, {
            upload_preset: 'CloudinaryDemo',
        });
        res.status(201).json({ msg: 'success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: err.message });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log('listening on 3001');
});
