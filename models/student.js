const mongoose = require('mongoose');
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
      this.find({}).skip(start).limit(pageSize).exec((err, res) => {
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
   }
}
// 初始化Student类
var Student = mongoose.model('Student', StudentSchema);

// 导出
module.exports = Student;