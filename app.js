const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const { exec } = require('child_process');
const path = require('path');
const os = require('os');
const util = require('util');
const cors = require('cors');
const execAsync = util.promisify(exec);
const config = require('./config.js');

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.use(express.static('public'));

app.get('/latex_to_image', async (req, res) => {
    const latexCode = req.query.latex_code;

    if (!latexCode) {
        return res.status(400).json({ error: 'No LaTeX code provided' });
    }
    console.log('latexCode:', latexCode);
    const docTemplate = `
\\documentclass[preview,border=12pt,varwidth]{standalone}
\\usepackage{amsmath}
\\begin{document}
${latexCode}
\\end{document}
    `;

    // Generate a unique temp file name
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'latex-'));
    const texPath = path.join(tempDir, 'temp.tex');
    const pdfPath = path.join(tempDir, 'temp.pdf');
    const pngPath = path.join(tempDir, 'temp.png');

    try {
        // Write the LaTeX document to a file
        await fs.writeFile(texPath, docTemplate);

        // Run pdflatex to generate PDF
        await execAsync(`pdflatex -output-directory ${tempDir} -interaction=nonstopmode ${texPath}`);

        // Check if temp.pdf is created successfully
        await fs.access(pdfPath);

        // Convert PDF to PNG using ImageMagick
        await execAsync(`${config.ImageMagick} -density 300 ${pdfPath} -quality 90 ${pngPath}`);

        // Check if temp.png is created successfully
        await fs.access(pngPath);

        const img = await fs.readFile(pngPath);
        res.set('Content-Type', 'image/png');
        res.send(img);
    } catch (err) {
        console.error('Error processing LaTeX:', err);
        return res.status(500).json({ error: 'Error processing LaTeX' });
    } finally {
        // Clean up temporary files
        try {
            await fs.rm(tempDir, { recursive: true, force: true });
        } catch (cleanupErr) {
            console.error('Error cleaning up temporary files:', cleanupErr);
        }
    }
});


const port = config.port || 9000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
