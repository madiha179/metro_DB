const path = require('path');
const multer = require('multer');
const AppError = require('./appError')
const fs = require('fs');

const UPLOAD_DIR  = path.join(__dirname, '../uploads');
const MAX_SIZE_MB  = 5;
const NO_OF_FILES = 3;
const ALLOWED_MIME = ['image/jpeg', 'image/jpg', 'application/pdf'];
const ALLOWED_EXT  = ['.jpg', '.jpeg', '.pdf'];

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        console.log('user ID: ', req.user?.id);
        cb(null, `user-${req.user?.id}-${Date.now()}${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    if(ALLOWED_MIME.includes(file.mimetype) && ALLOWED_EXT.includes(ext))
        return cb(null, true);
    else
        cb(new AppError('Only jpg, jpeg, pdf allowed.', 400), false);
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter, 
    limits: {
        fileSize: MAX_SIZE_MB * 1024 * 1024,
        files: NO_OF_FILES,
    }
});

const uploadSubDocs = upload.fields([
    { name: 'nationalId_front', maxCount: 1 },
    { name: 'nationalId_back',  maxCount: 1 },
    { name: 'universityId',     maxCount: 1 },
]);

const handleUploadErrors = (req, res, next) => {
    uploadSubDocs(req, res, (err) => {
        if (!err) return next();
    
        if (err instanceof multer.MulterError) {
        const messages = {
            LIMIT_FILE_SIZE: `File too large. Maximum size is ${MAX_SIZE_MB}MB.`,
            LIMIT_FILE_COUNT: 'Too many files uploaded.',
            LIMIT_UNEXPECTED_FILE: err.message || 'Unexpected file field.',
        };
        return res.status(400).json({ 
            success: false, 
            message: messages[err.code] || err.message
        });
        }
    
        // Unknown error
        return res.status(500).json({ 
            success: false, 
            message: err.message || 'File upload failed.' 
        });
    });
};

module.exports = { handleUploadErrors };