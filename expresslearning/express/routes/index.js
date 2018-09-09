var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var dbConfig = require('../db/DBConfig');
var userSQL = require('../db/sql');
// 使用DBConfig.js的配置信息创建一个MySQL连接池
var pool = mysql.createPool(dbConfig.mysql);
// 响应一个JSON数据
var responseJSON = function (res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    });
  } else {
    res.json({code:200,msg:'ok',data:ret});
  }
};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/selectAllUsers', function (req, res, next) {
  // 从连接池获取连接 
  pool.getConnection(function (error, connection) {
    // 获取前台页面传过来的参数  
    if(error) throw error;
    // 建立连接 增加一个用户信息 
    connection.query(userSQL.queryAll, function (err, rs) {
      if(err){
        console.error(err+userSQL.queryAll);
        return;
      }
      // 以json形式，把操作结果返回给前台页面     
      responseJSON(res, rs);
      
      // 释放连接  
      connection.release();

    });
  });
});

router.get('/insertHost',function(req,res,next){
  pool.getConnection(function(error,connection){
    var param = req.query || req.params;
    if(error) console.error(error+'CONNECTION');
    if(param.name && param.sex!==undefined && param.isStayed!==undefined){
      connection.query(userSQL.insert,[param.name,param.sex,param.isStayed],function(err,rs){
        if(err){
            console.error('INSERT-ERROR'+err);
        }
        responseJSON(res, rs);
        connection.release();
      })
    }else{
      console.error('PARAMS-ERROR'+'名字'+param.name+'性别'+param.sex+'是否留宿'+param.isStayed);
    }
    
  })
});
module.exports = router;
