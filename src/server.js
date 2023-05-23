const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const docxConverter = require('docx-pdf');

const app = express();
app.use(fileUpload());

app.post('/convert', (req, res) => {
  if (!req.files || !req.files.wordFile) {
    return res.status(400).send('No files were uploaded.');
  }

  const wordFile = req.files.wordFile;

  if (wordFile.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return res.status(400).send('Invalid file format. Please upload a .docx file.');
  }

  if (wordFile.size > 5 * 1024 * 1024) {
    return res.status(400).send('File size exceeds the limit of 5MB.');
  }

  const fileName = `${Date.now()}_${wordFile.name.replace(/\s/g, '_')}`;
  const pdfFilePath = path.join(__dirname, 'uploads', `${fileName}.pdf`);

  wordFile.mv(path.join(__dirname, 'uploads', fileName), (error) => {
    if (error) {
      console.error(error);
      return res.status(500).send('Internal server error.');
    }

    docxConverter(`${fileName}`, pdfFilePath, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).send('Internal server error.');
      }

      return res.download(pdfFilePath, `${fileName}.pdf`, (error) => {
        if (error) {
          console.error(error);
          return res.status(500).send('Internal server error.');
        }

        // Clean up the uploaded files
        // eslint-disable-next-line no-undef
        fs.unlinkSync(path.join(__dirname, 'uploads', fileName));
        // eslint-disable-next-line no-undef
        fs.unlinkSync(pdfFilePath);
      });
    });
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
