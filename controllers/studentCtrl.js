const Student = require('../models/student'),
    Admin = require('../models/admin'),
    formidable = require('formidable')


module.exports = {
    //渲染首页信息，(首页包含学生信息)
    shwoIndex(req, res) {
        let page = req.query.page ? req.query.page : 1;
        Admin.checkUser({ username: req.session.s_id }, function (adminResults) {
            console.log(req.session.s_id)
            Student.findPageData(page, function (studentR) {
                console.log(adminResults)
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
    }
}