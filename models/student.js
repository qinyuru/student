const mongoose = require('mongoose'),
      fs = require('fs'),
      path = require('path');
mongoose.set('useFindAndModify', false);
// 1.声明schema
let StudentSchema = new mongoose.Schema({
   sid: Number, // 学生的学号
   name: String, // 名字
   sex: String, // 性别
   age: Number // 年龄
});

StudentSchema.statics = {
   findPageData: async function (page, cb) {
      let pageSize = 4;
      let start = (page - 1) * pageSize;
      let count = await this.find().countDocuments();
      this.find({}).sort({sid:-1}).skip(start).limit(pageSize).exec((err, res) => {
         if (err) {
            cb({ error: 0 });
            return;
         }
         cb({
            count,
            error: 1,
            data: res,
            length: Math.ceil(count / pageSize),
            now: page
         });
      })

   },
   changeStudent: function (sid, data, cb) {
      this.findOneAndUpdate({ sid }, { $set: data }, (err) => {
         if (err) {
            cb(-1);
            return;
         }
         cb(1)
      })
   },
   //通过正则做模糊搜索
   findStudentNames(reg, cb) {
      this.find(
         { name: { $regex: reg, $options: "$g" } },
         (err, results) => {
            if (err) {
               cb({ error: 0,data:null })
               return
            }
            cb({ error: 1,data:results })
         }
      )
   },
   //导出Excel
   exportExcel(callback){
      //查询所有学生数据：
      this.find({},(err,results)=>{
         if(err){
            callback({error:0,msg:'未查询到任何数据'});
            return;
         }
         var datas = [];//存储excel表的格式
         var col = ['_id','sid','name','sex','age'];//俗称列
         
         datas.push(col);
         //内容
         results.forEach(function (item){
            var arrInner = [];
            arrInner.push(item._id);
            arrInner.push(item.sid);
            arrInner.push(item.name);
            arrInner.push(item.sex);
            arrInner.push(item.age);
            datas.push(arrInner);
         })
         //数组数据转换为底层excel表的二进制数据
         var buffer = nodeXlsx.build([{name:'1902',data:datas}]);
         let urlLib = path.join(__dirname,'../');
         // console.log(urlLib);
         //{'flag':'w'}   w:以写入模式打开文件，如果文件不存在则创建。 flags - 文件打开的行为
         fs.writeFile(`${urlLib}public/excel/banji.xlsx`,buffer,{'flag':'w'},function (err){
            if(err){
               callback({error:0,msg:'excel导出失败'});
               return;
            }
            callback({error:1,msg:`banji.xlsx`});
         });
         // callback(buffer);
      })
   },
   //添加学生
   saveStudent(data,callback) {
      this.find({},{sid:1}).sort({sid:-1}).limit(1).exec(function (err,results){
         // console.log(results.length);return
         let sid = results.length > 0 ? Number(results[0]['sid'])+1 : 100001;
         let student = new Student({
            ...data,
            sid
         });
         student.save(err=>{
            if(err){
               callback({error:0,msg:'保存失败'});
               return;
            }
            callback({error:1,msg:'保存成功'});
         })
      })
   },
   //删除学生
   deleteStudent(sid,callback) {
      this.find({sid},(err,results)=>{
         //results [{_id:12345,name:xxx}]
         // console.log(results);
         var somebody = results[0];
         somebody.remove(err=>{
            if(err){
               callback({error:0,msg:'删除失败'});
               return;
            }
            callback({error:1,msg:'删除成功'});
         })
      })
   }
}
// 初始化Student类
var Student = mongoose.model('Student', StudentSchema);

// 导出
module.exports = Student;