const {Router}=require('express')
const multer=require('multer');
const path=require('path');
const fs=require('fs');

const Blog=require('../models/blogs');
const Comment = require('../models/comment');

const router=Router();

const uploadDir = path.resolve('./public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,uploadDir);
    },
    filename: function (req, file, cb) {
      const fileName=`${Date.now()} - ${file.originalname}`;
      cb(null,fileName);
    }
});
const upload = multer({ storage: storage });

router.get('/addblog',(req,res)=>{
    res.render("addBlog" ,{
        user : req.user,
    })
});

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy");
    const comments=await Comment.find({ blogId : req.params.id}).populate("createdBy");
    // console.log(blog);
    res.render("blogPage",{
        user : req.user,
        blog,
        comments
    });
});

router.post('/',upload.single('coverImage'),async (req,res)=>{
    const { title ,body }=req.body;
    const blog= await Blog.create({
        title,
        body,
        createdBy : req.user._id,
        coverImageURL : `/uploads/${req.file.filename}`,
    })
    res.redirect(`/blog/${blog._id}`);
});

router.post('/comment/:blogid', async (req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId: req.params.blogid,
        createdBy : req.user._id,
    });

    res.redirect(`/blog/${req.params.blogid}`);
})

module.exports= router;