// 启动入口文件
const express = require('express'),
      mongoose = require('mongoose'),
      cookieSession = require('cookie-session'),
      loginCtrl = require('./controllers/loginCtrl'),
      studentCtrl = require('./controllers/studentCtrl');

// 连接数据库 端口号不需要写 sm为数据库名称 
mongoose.connect('mongodb://localhost/sm',{useNewUrlParser:true,useUnifiedTopology:true});

let app = express();

app.set('view engine','ejs');

app.use(cookieSession({
    name:'sess_id',
    keys:['key1'],
    maxAge: 30 * 60 * 1000 // 30min  
}))

// 处理静态资源
app.use(express.static('public'));
// 登录验证：
app.use((req,res,next)=>{
    if(!req.session['s_id'] && req.url != '/login'){
        // 没有登录过
        res.redirect('/login');
        return;
    }
    next();
})

// 路有清单
app.get('/login',loginCtrl.showLogin); // 访问登录页面
app.post('/login',loginCtrl.doLogin) ; // 访问登录接口，处理登录操作
app.propfind('/login',loginCtrl.checkUser); // 访问接口 验证用户名是否存在
app.get('/', studentCtrl.shwoIndex); // 访问首页
app.get('/student/msg', studentCtrl.showList); //访问接口，渲染数据
app.get('/student/search', studentCtrl.searchStudent); //模糊搜索
app.post('/student/:sid',studentCtrl.updateStudent); //访问接口 处理修改学生数据




app.listen(3000);

