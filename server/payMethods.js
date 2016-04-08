Meteor.methods({
  getOpenidByCodeForPay: function(code) {
    var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx35fc3ff5c073eb9b&secret=1051d7ee32aa23310c0b6d8e3b12cd05&code="
            + code
            + "&grant_type=authorization_code";
    console.log(url);
    try {
      var result = HTTP.get(url);
      // console.log("result =", result);
      var openid = JSON.parse(result.content).openid
      console.log(openid);
      return openid;

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return "error: " + e;
    }
  },
  createChargeWx: function(openid, amount) {
    var json = {
      "order_no": "maodou004",
      "subject": "活动报名",
      "body": "Your Body",
      "amount": "1",
      "channel": "wx_pub",
      "currency": "cny",
      "client_ip": "127.0.0.1",
      "app": {
        "id": "app_Py9i5SaXzLGGTyzP"
      },
      "extra": {
        "open_id": "xxxxxxxxxxxxx"
      }
    }
    json.extra.open_id = openid;
    json.amount = amount;
    json.order_no = Random.id([15]);

    var posturl = "https://api.pingxx.com/v1/charges";
    var header = {Authorization: "Basic c2tfbGl2ZV9IZTVDMENQR0s4eUhPcUxHQ0tiUEdHODg6"};
    try {
      var result = HTTP.post(posturl, {headers:header,data: json});
      // console.log("result =", result);
      console.log(result);
      return result.data;

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return "error: " + e;
    }
  },
});
