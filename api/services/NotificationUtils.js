module.exports = {
  //thông báo những người comment bài đăng đến ng đăng bài và ng comment bài
  notifiPostUser_Comment: async function(post_id, data, req) {
    let post = await Post.findOne({ id: post_id });
    // let datanotifi = {
    //   userId: req.session.user.id,
    //   url_ref: "/post.notifi." + postId,
    //   text: " đã bình luận bài đăng " + post.title + " của",
    //   type: "comment",
    //   time: Date.now(),
    //   data: data,
    //   incognito: req.session.user.incognito
    // };
    // let notifi = await Notification.create(datanotifi);
    // notifi.user_notifi = req.session.user;

    // let listIdPostRef = [];
    // listIdPostRef[0] = req.session.user.id;
    // listIdPostRef[1] = post.userId_post;
    // if (post.userId_wall) listIdPostRef[2] = post.userId_wall;

    // let listUserComment = await Comment.find({
    //   postId,
    //   groupBy: "userId_comment",
    //   userId_comment: { "!": listIdPostRef }
    // }).sum();
    // console.log("lisst", listUserComment);
    // if (post.userId_post != req.session.user.id)
    //   listUserComment.push({ userId_comment: post.userId_post });
    // if (post.userId_wall)
    //   listUserComment.push({ userId_comment: post.userId_wall });
    // console.log("list", listUserComment);
    // listUserComment.forEach(user => {
    //   //tăng sô thông báo tưng user

    //   User.findOne({ id: user.userId_comment }).exec((err, user) => {
    //     if (!user.number_notifi) user.number_notifi = 1;
    //     else user.number_notifi += 1;
    //     user.save({});
    //   });
    //   //tạo thông báo
    //   Ref_notification_user.create({
    //     notificationId: notifi.id,
    //     userId: user.userId_comment,
    //     readNotifi: false,
    //     status: true
    //   }).exec({});

    //   //đồng bộ thông báo điến các user
    //   sails.sockets.broadcast(
    //     "NotificationUser",
    //     "notifi_user" + user.userId_comment,
    //     notifi,
    //     req
    //   );
    // });
    let listFollow_Post = await Follow_post.find({ post_id, status: 1 });
    let datanotifi = {
      userId: req.session.user.id,
      url_ref: "/post.notifi." + post_id,
      text: " đã bình luận bài đăng " + post.title + " của",
      type: "comment",
      time: Date.now(),
      data: data,
      incognito: req.session.user.incognito
    };
    let notifi = await Notification.create(datanotifi);
    notifi.user_notifi = req.session.user;

    let listDataInsert = [];

    //duyệt trên danh sách follow bài viết để gửi notify
    listFollow_Post.forEach(follow_post => {
      User.findOne({ id: follow_post.user_id }).exec((err, user) => {
        if (!user.number_notifi) user.number_notifi = 1;
        else user.number_notifi += 1;
        user.save({});
      });
      let dataInsert = {
        notificationId: notifi.id,
        userId: follow_post.user_id,
        readNotifi: false,
        status: true
      };
      listDataInsert.push(dataInsert);
      //đồng bộ thông báo điến các user
      sails.sockets.broadcast(
        "NotificationUser",
        "notifi_user" + follow_post.user_id,
        notifi,
        req
      );
    });

    //insert listdataNotifi ref
    Ref_notification_user.create(listDataInsert).exec(() => {});
  },
  follow_post: async function(post_id, data) {
    let listFollow_Post = await Follow_post.find({ post_id, status: 1 });
    let datanotifi = {
      userId: req.session.user.id,
      url_ref: "/post.notifi." + postId,
      text: " đã bình luận bài đăng " + post.title + " của",
      type: "comment",
      time: Date.now(),
      data: data,
      incognito: req.session.user.incognito
    };
    let notifi = await Notification.create(datanotifi);
    notifi.user_notifi = req.session.user;

    let listDataInsert = [];

    //duyệt trên danh sách follow bài viết để gửi notify
    listFollow_Post.forEach(follow_post => {
      User.findOne({ id: user.follow_post.user_id }).exec((err, user) => {
        if (!user.number_notifi) user.number_notifi = 1;
        else user.number_notifi += 1;
        user.save({});
      });
      let dataInsert = {
        notificationId: notifi.id,
        userId: follow_post.user_id,
        readNotifi: false,
        status: true
      };
      listDataInsert.push(dataInsert);
      //đồng bộ thông báo điến các user
      sails.sockets.broadcast(
        "NotificationUser",
        "notifi_user" + follow_post.user_id,
        notifi,
        req
      );
    });

    //insert listdataNotifi ref
    Ref_notification_user.create(listDataInsert).exec(() => {});
  },
  //thông báo like bài viết
  notifiPostUser_Like: async function(post, req) {
    let datanotifi = {
      userId: req.session.user.id,
      url_ref: "/post.notifi." + post.id,
      text: " đã thích bài đăng " + post.title + " của",
      type: "like",
      time: Date.now(),
      data: post,
      incognito: req.session.user.incognito
    };
    let notifi = await Notification.create(datanotifi);
    notifi.user_notifi = req.session.user;
    Ref_notification_user.create({
      notificationId: notifi.id,
      userId: post.userId_post,
      readNotifi: false,
      status: true
    }).exec({});
    sails.sockets.broadcast(
      "NotificationUser",
      "notifi_user" + post.userId_post,
      notifi,
      req
    );
  },
  //thông báo tag bài viết lúc tạo bài viết
  tagPost: async function(post_id, listTag, req) {
    let datanotifi = {
      userId: req.session.user.id,
      url_ref: "/post.notifi." + post_id,
      text: "Đã gắn thẻ bạn vào 1 bài viết",
      type: "tag_post",
      time: Date.now()
      // data:post
    };
    let notifi = await Notification.create(datanotifi);
    let listDataInsert = [];
    for (var i = 0; i < listTag.length; i++) {
      notifi.user_notifi = req.session.user;
      User.findOne({ id: listTag[i].id }).exec((err, user) => {
        if (!user.number_notifi) user.number_notifi = 1;
        else user.number_notifi += 1;
        user.save({});
      });
      let dataInsert = {
        notificationId: notifi.id,
        userId: listTag[i].id,
        readNotifi: false,
        status: true
      };
      sails.sockets.broadcast(
        "NotificationUser",
        "notifi_user" +  listTag[i].id,
        notifi,
        req
      );
      listDataInsert[i] = dataInsert;
    }
    Ref_notification_user.create(listDataInsert).exec({});
  },
  postToFriend: async function(post, req) {
    let listfriend = await Friends.find({
      or: [
        { userId_one: req.session.user.id, status: 1 },
        { userId_two: req.session.user.id, status: 1 }
      ]
    });
    if (post.userWall) {
      let datanotifi = {
        userId: req.session.user.id,
        url_ref: "/post.notifi." + post.id,
        text: "Đã đăng lên tường của bạn",
        type: "friend",
        time: Date.now(),
        data: post
      };
      let notifi = await Notification.create(datanotifi);
      notifi.user_notifi = req.session.user;
      User.findOne({ id: post.userWall.id }).exec((err, user) => {
        if (!user.number_notifi) user.number_notifi = 1;
        else user.number_notifi += 1;
        user.save({});
      });
      Ref_notification_user.create({
        notificationId: notifi.id,
        userId: post.userWall.id,
        readNotifi: false,
        status: true
      }).exec({});
      sails.sockets.broadcast(
        "NotificationUser",
        "notifi_user" + post.userWall.id,
        notifi,
        req
      );
    }
    for (var i = 0; i < listfriend.length; i++) {
      let userIdPatner =
        listfriend[i].userId_one == req.session.user.id
          ? listfriend[i].userId_two
          : listfriend[i].userId_one;

      sails.sockets.broadcast(
        "Subscribe_Status",
        "post" + userIdPatner,
        post,
        req
      );
    }
  },
  notifiAccessFriend: async function(statusFriend, userFriend, req) {
    // let post = await Post.findOne({id:postId});
    let datanotifi = {
      userId: req.session.user.id,
      url_ref: "",
      text:
        statusFriend == 0
          ? " đã yêu gửi yêu cầu kết bạn đến "
          : " đã đồng ý kết bạn với ",
      type: "friend",
      time: Date.now(),
      data: userFriend
    };
    let notifi = await Notification.create(datanotifi);
    notifi.user_notifi = req.session.user;
    User.findOne({ id: userFriend.id }).exec((err, user) => {
      if (!user.number_notifi) user.number_notifi = 1;
      else user.number_notifi += 1;
      user.save({});
    });

    Ref_notification_user.create({
      notificationId: notifi.id,
      userId: userFriend.id,
      readNotifi: false,
      status: true
    }).exec({});
    sails.sockets.broadcast(
      "NotificationUser",
      "notifi_user" + userFriend.id,
      notifi,
      req
    );
  },
  like: "like"
};
