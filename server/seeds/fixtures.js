if (Activities.find().count() < 3) {

  var imgArr = [
    "http://7xojrr.com1.z0.glb.clouddn.com/2010010718294609.jpg",
    "http://7xojrr.com1.z0.glb.clouddn.com/2011040418415536.jpg",
    "http://7xojrr.com1.z0.glb.clouddn.com/android-wallpapers-640-480-dailymobile030.jpg",
    "http://7xojrr.com1.z0.glb.clouddn.com/2011070760080906.jpg"
  ];

  var titleArr = [
    "法兰黛【随波逐流我不介意】",
    "敬你一碗边疆酒",
    "慢下来，和心灵对画",
    "北高峰爬山"
  ];

  var descArr = [
    "初来乍到，婉如清飏我们跟著风一起过来第一次的相遇 欸，随波逐流我不介意，我的眼望著天际。 让生命的流，载著浮，与沉。不奋力挣扎，不强求方向；让岩石来划伤，让波涛都经过。摩擦生出温柔之后，期待它长成真正的坚强。",
    "南二巷乐队，成立于2010年,《在路上》 从军行七首 王昌龄 青海长云暗雪山, 孤城遥望玉门关.黄沙百战穿金甲, 不破楼兰终不还. 他们是来自新疆的南二巷，他们的音乐总是带有边疆的狂放与不羁。温热多雨的南方滋养了多少文人墨客。而如今，单枪匹马，南二巷来了！带着西域的风沙，带着边疆的凄美，带着与生俱来的狂放，还带着边疆的酒！来，10月30日，东莞SoWhat Livehouse一起举起手中的酒杯，一起与南二巷感受狂放。",
    "一节绘画课3小时 但画画绝不是一个3小时的事情 是一种延续的练习、创造、和自我交流和突破 即将过去的365天 是和绘画有关的365天 即将到来的365天 我们也用绘画来充实它吧 让每一天都不虚度 壹号画苑欢迎每一个爱画画的小伙伴同我们一起享受宁静的绘画时光 ●零基础的小伙伴 我们将提供针对性的绘画学习课程 ●有绘画能力及基础的小伙伴 我们将为你提供安静的绘画自习室我们为你提供安静的绘画空间 分享一个美好夏日的午后",
    "每周的周末我们都会去一次北高峰，从北侧的寺庙上山后，经过两小时的徒步从浙大方向下山。是否有人愿意一起参与到这个活动中来呢？"
  ];

  var whereArr = [
    "海珠区工业大道北132号",
    "东莞 SO WHAT LIVEHOUSE",
    "汉口 江岸区 长青广场",
    "杭州北高峰"
  ];

  for (var index = 0; index < imgArr.length; index++) {
    var element = imgArr[index];
    var fileObj = new FS.File();
    console.log(element + " downloading ...");
    var result = request.getSync(element, {encoding: null, rejectUnauthorized: false});
    var buffer = result.body;
    console.log(result.response.headers);
    fileObj.attachData(buffer, {type: result.response.headers['content-type']});
    var image = Images.insert(fileObj);

    Meteor.call("insertData",
      titleArr[index],
      descArr[index],
      image._id,
      new Date(),
      whereArr[index]
    );
  }
}
