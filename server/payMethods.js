Meteor.methods({
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
        "id": "app_eHqjLKjjjT8CLGaX"
      },
      "extra": {
        "open_id": "xxxxxxxxxxxx"
      }
    }
    json.extra.open_id = openid;
    json.amount = amount;
    json.order_no = Random.id([15]);
    // json.order_no = orderNum;

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
