const { query } = require("express")

class Features{
    constructor(query,querystr){
        this.query=query;
        this.querystr=querystr;
    }

    search(){
        const keyword=this.querystr.keyword?{
            name:{
                $regex:this.querystr.keyword,
                $options:'i'
            }
        }:{}

        console.log(keyword); 

        this.query=this.query.find({...keyword});
        return this;
    }
}

module.exports=Features;