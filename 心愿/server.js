const express=require("express")
const http=express()
const mongodb=require("./db.js")
const db=new mongodb("hope")
const bodyParser=require("body-parser")
const postparse=bodyParser.urlencoded({extended:false})

http.use(express.static("./hope"))
http.listen(8080,()=>{
	console.log("is running")
})
//获取
http.post("/add",postparse,(req,res)=>{
	db.find("hope_list",{query:{hope:req.body.hope}},(err,data)=>{
		//判断是否愿望重复
		if (data.length==0) {
			db.insertOne("hope_list",req.body,(err,data)=>{
				if(err)throw err
				res.send(data)
			})
		}else{
			res.send({
				status:"1",
				statusText:"愿望重复"
			})
		}
	})
})
//添加
http.get("/msg",(req,res)=>{
	db.find("hope_list",{query:{}},(err,data)=>{
		if(err)throw err
		sj(data)
		if (data.length<=8) {
			res.send(data)
		}else{
			res.send(data.slice(0,8))
		}
	})
})
//删除
http.get("/del",(req,res)=>{
	console.log(req.query.id)
	db.deleteById("hope_list",req.query.id,(err,data)=>{
		if(err)throw err
		res.send(data)
	})
})
//完成
http.post("/sure",postparse,(req,res)=>{
	db.updateById('hope_list',req.body.id,{flag:req.body.flag},(err,data)=>{
		if(err) throw err;
		res.send(data)
	})
})


//封装的随机
function sj(arr){
	var num;
	for (var i = 0; i < arr.length; i++) {
		var index=parseInt(Math.random()*arr.length) 
		num=arr[index]
		arr[index]=arr[i]
		arr[i]=num
	}
	return arr
}
