/*处理路由访问 */
const express = require('express');

let router = express.Router();

//路由请求：
router.get('/',(req,res)=>{
    res.send('登录');
})
router.get('/out',(req,res)=>{
    res.json('退出');
})

module.exports = router;