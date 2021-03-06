import React from "react";
import Post from "app/utils/components/PostStatusAnDanh";
import axios from "axios";
import "react-select/dist/react-select.css";
var Select = require("react-select");
import { connect } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

class PostNotifi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null,
      options: [],
      subject: null
    };
  }
  componentDidMount() {
    let self = this;
    let { postId } = this.props.match.params;
    io.socket.post("/post/getDetail", { postId }, function(resdata, jwres) {
      console.log("listpost", resdata);
      if (resdata.EC == 0) self.setState({ status: resdata.DT });
    });
  }
  componentWillReceiveProps(nextProps) {
    let self = this;
    let { postId } = nextProps.match.params;
    io.socket.post("/post/getDetail", { postId }, function(resdata, jwres) {
      if (resdata.EC == 0) self.setState({ status: resdata.DT });
    });
  }
  likePost() {
    this.state.status.userLikePost = !this.state.status.userLikePost;
    this.setState({ status: this.state.status });
  }
  like(postId) {
    console.log("like", postId);
    let self = this;
    this.likePost();
    io.socket.post(
      "/likepost/accessLike",
      { postId, userId: this.props.auth.user.id },
      (resdata, jwres) => {
        console.log("resdata", resdata);

        if (resdata.EC == 0) {
          self.state.status.countLike = resdata.DT.countLike;
          self.setState({ status: self.state.status });
        } else {
        }
      }
    );
  }
  componentWillMount() {
    let self = this;
    io.socket.get("/notification/follow", function gotResponse(data, jwRes) {
      console.log(
        "Server responded with status code " + jwRes.statusCode + " and data: ",
        data
      );
    });
  }

  accessLike(postId, verb) {
    this.state.status.countLike =
      verb == "like"
        ? this.state.status.countLike + 1
        : this.state.status.countLike - 1;
    this.setState({ status: this.state.status });
  }
  deletePost(data) {
    if (data.id == this.state.status.id) {
      this.setState({ status: null });
    }
  }
  render() {
    let { status } = this.state;
    let ListStatus = status ? (
      <Post
        accessLike={this.accessLike.bind(this)}
        post={status}
        like={this.like.bind(this)}
        deletePost={this.deletePost.bind(this)}
        key={status.id}
      />
    ) : (
      <div
        style={{
          textAlign: "center",
          padding: "12px",
          fontSize: "13px",
          color: "#7a887a"
        }}
      >
        <div style={{ fontSize: 15, lineHeight: 2 }}>
          <h1>
            {" "}
            <Skeleton />
          </h1>
          <Skeleton count={6} />
        </div>
      </div>
    );
    return (
      <div>
        <div className="col-md-8">{ListStatus}</div>
      </div>
    );
  }
}
module.exports = connect(function(state) {
  return { auth: state.auth };
})(PostNotifi);
