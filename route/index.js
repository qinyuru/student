//处理路由
const express = require('express'),
      loginCtrl = require('../controllers/loginCtrl'),
      {
        showIndex:sI,
        showList:sL,
        searchStudent:sS,
        exportStudentToExcel:eSTE,
        showAddStudent:sAS,
        addStudent:aS,
        updateStudent:uS,
        deleteStudent:dS
      } = require('../controllers/studentCtrl'),
      {logout} = require('../controllers/Logout');

//生成路由：
let router = express.Router();

// 登录验证：
router.use((req,res,next)=>{
    if(!req.session['s_id'] && req.url != '/login'){
        // 没有登录过
        res.redirect('/login');
        return;
    }
    next();
})

// 路有清单
router.get('/login',loginCtrl.showLogin); // 访问登录页面
router.post('/login',loginCtrl.doLogin) ; // 访问登录接口，处理登录操作
router.propfind('/login',loginCtrl.checkUser); // 访问接口 验证用户名是否存在

router.get('/', sI); // 访问首页
router.get('/student/msg', sL); //访问接口，渲染数据
router.get('/student/search', sS); //模糊搜索
router.get('/student/exportExcel',eSTE);//访问接口 处理学生数据导出
router.get('/student/addStudent',sAS);//访问增加学生页面
router.put('/student/addStudent',aS);//访问接口处理增加学生
router.post('/student/:sid',uS); //访问接口 处理修改学生数据
router.delete('/student/:sid',dS);//访问接口 处理删除学生

//退出
router.get('/Logout',logout)//访问接口 处理退出

module.exports = router;