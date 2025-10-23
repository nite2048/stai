import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const UPLOAD_DIR = path.join(dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
     destination: (req, file, cb) => cb(null, UPLOAD_DIR),
     filename: (req, file, cb) => {
          const original = path.basename(file.originalname || 'file');
          const safe = original.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, '');
          const filename = `${Date.now()}-${safe}`;
          cb(null, filename);
     }
});

function fileFilter(req, file, cb) {
     if (file && file.mimetype && file.mimetype.startsWith('image/')) {
          cb(null, true);
     } else {
          cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Only image files are allowed'));
     }
}

const upload = multer({
     storage,
     fileFilter,
     limits: {
     fileSize: 10 * 1024 * 1024, // 10 MB
     files: 1
     }
});

export async function handleUpload(req, res){
     upload.single('image')(req, res, (err) => {
       if (err) {
          if (err instanceof multer.MulterError) {
               let msg = err.message;
               if (err.code === 'LIMIT_FILE_SIZE') msg = 'File is too large (max 10MB).';
               if (err.code === 'LIMIT_UNEXPECTED_FILE') msg = 'Invalid file type or field.';
               return res.status(400).json({ message: msg }) //Multer Specific Error
          }
          return res.status(500).json({ message: 'Upload failed', error: err.message });
       }

       if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
       // return res.json({ message: 'Upload successful', filename: req.file.filename });
     });
}

export function readDir(req, res){
     fs.readdir(UPLOAD_DIR, (err, files) => {
       if (err) return res.status(500).json({ message: 'Could not list uploads' });
       res.json({ files });
     });
}

export function downloadFile(req, res){
     const name = path.basename(req.params.filename);
     const filePath = path.join(UPLOAD_DIR, name);

     fs.stat(filePath, (err, stats) => {
          if (err || !stats.isFile()) return res.status(404).json({ message: 'File not found' });

          res.download(filePath, name, (downloadErr) => {
               if (downloadErr) console.error('Download error:', downloadErr);
          });
     });
}
