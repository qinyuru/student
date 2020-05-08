const Student = require('../models/student'),
    Admin = require('../models/admin'),
    formidable = require('formidable')
    nodeXlsx = require('node-xlsx');


module.exports = {
    //渲染首页信息，(首页包含学生信息)
    showIndex(req, res) {
        let page = req.query.page ? req.query.page : 1;
        Admin.checkUser({ username: req.session.s_id }, function (adminResults) {
            // console.log(req.session.s_id)
            Student.findPageData(page, function (studentR) {
                // console.log(adminResults)
                res.render('index', {
                    adminData: adminResults.data,
                    studentData: studentR
                })
            })
        })
    },
    //访问接口 获取学生某一页数据
    showList(req, res) {
        let page = req.query.page || 1
        Student.findPageData(page, function (results) {
            res.json(results)
        })
    },
    updateStudent(req, res) {
        let sid = req.params.sid
        let form = formidable()
        form.parse(req, (err, fields) => {
            console.log(fields)
            Student.changeStudent(sid, fields, (results) => {
                res.json({ error: results })
            })
        })
    },
    //通过正则做模糊搜索
    searchStudent(req, res) {
        Student.findStudentNames(req.query.search, (results) => {
            res.json(results)
        })
    },
    //访问接口 处理学生数据导出
    exportStudentToExcel(req,res){
        //查询所有学生数据：
        Student.exportExcel((data)=>{
            res.send(data);
        })
    },
    //访问学生页面
    showAddStudent(req, res) {
        Admin.checkUser({ username: req.session.s_id }, function (adminResults) {
            res.render('addStudent', {
                adminData: adminResults.data,
            })
        })
    },
    //访问增加学生接口
    addStudent(req, res) {
        let form = formidable();
        form.parse(req,(err,fields)=>{
            if( err ){
                res.json({error:0,msg:'数据接收失败'});
                return;
            }
            Student.saveStudent(fields,(results)=>{
                res.json(results);
            })
        })
    },
    //删除学生接口
    deleteStudent(req, res) {
        // /student/:sid
        let sid = req.params.sid;
        // console.log(sid);
        Student.deleteStudent(sid,(results)=>{
            res.json(results);
        })
    }
}