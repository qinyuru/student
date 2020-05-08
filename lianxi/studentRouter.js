/*处理路由访问 */
const express = require('express');

let router = express.Router();

//路由请求：
router.get('/',(req,res)=>{
    res.send('登录');
})
router.get('/:sid',(req,res)=>{
    res.json(req.params.sid);
})
router.post('/add',(req,res)=>{
    res.send('添加');
})

module.exports = router;