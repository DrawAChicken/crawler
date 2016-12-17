/**
 * Created by ssslb on 2016/12/16.
 */
var http=require("http");
var fs=require("fs");
var cheerio=require("cheerio");
var url="http://www.imooc.com/learn/348";

function filterdata(html) {
    var $=cheerio.load(html)
    var data=$(".chapter")
    var all=[]
    data.each(function () {
        var reg=/^\s+|\s+$/g;
        // 获取小节名
        var ss=$(this).find("strong").text();
        //console.log($(this).find(".J-media-item").attr("href").split("video/")[1]);
        var video=$(this).find(".J-media-item");
        // 获取视频名称和id
        var videos=[];
        video.each(function () {
            var date={
                name:$(this).text().split("(")[0].replace(reg," "),
                id:$(this).attr("href").split("video/")[1]
            };
            videos.push(date)
        });
        // 获取小节完整数据
        var JSON={
            name:ss.replace(reg," ").split("                               ")[0].replace(reg," "),
            video:videos
        };
        all.push(JSON)
    })
    return JSON.stringify(all)
}

function crawler() {
    http.get(url,function (res) {
        var html="";
        res.on("data",function (data) {
            html+=data
        });
        res.on("end",function () {
            fs.writeFile('/Users/sss/Desktop/message.json', filterdata(html), function (err) {
                if (err) throw err;
                console.log('It\'s saved!'); //文件被保存
            });
        })
    });
}
exports.crawler=crawler;