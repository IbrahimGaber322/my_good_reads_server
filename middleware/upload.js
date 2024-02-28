import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
      if(typeof file !== "string"){
        const serverUrl = `${req.protocol}://${req.get("host")}/uploads/`;
        const fileExtension = file.originalname.split('.').pop();
        const randomFilename = uuidv4() + '.' + fileExtension;
        req.filePath = serverUrl+randomFilename;
        cb(null, randomFilename);
      }
    },
  });
  const upload = multer({ storage });
  export default upload;