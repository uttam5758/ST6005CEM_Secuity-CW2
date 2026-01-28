const multer =  require("multer")
const path =  require("path")

const storage =  multer.diskStorage({
    destination : (req,file,cb)=>{
        cb(null,'./uploads')
    },
    filename : (req,file,cb) =>{
        let ext =  path.extname(file.originalname)
        cb(null,`${file.fieldname}-${Date.now()}${ext}`)
    }
})
const imagefileFilter =  (req,file,cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|Svg|jfif)$/)){
        return cb(new Error("You can upload only image files"),false)
    }
    cb(null,true)
}

const upload =  multer({storage:storage,fileFilter:imagefileFilter})

module.exports  = upload