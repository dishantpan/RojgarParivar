const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Aadhar / ID documents
const aadharStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'rozgar/aadhar', allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'] },
});

// Storage for job work photos
const workPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'rozgar/work-photos', allowed_formats: ['jpg', 'jpeg', 'png'] },
});

// Storage for business license docs
const licenseStorage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'rozgar/licenses', allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'] },
});

const uploadAadhar    = multer({ storage: aadharStorage });
const uploadWorkPhoto = multer({ storage: workPhotoStorage });
const uploadLicense   = multer({ storage: licenseStorage });

module.exports = { cloudinary, uploadAadhar, uploadWorkPhoto, uploadLicense };
