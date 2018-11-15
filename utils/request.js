const GlobalUrl = "https://shop.chunyajkkj.com/ch/";
//
var Token = "";
const _SetToken = function(token) {
  Token = token;
  console.log(Token)
};
//关于我们
const _AboutChunya = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/official/commonArticle`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};


//故事模块清空所有收藏
const _CollectDeleteAll = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/collect/deleteAll`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}

//故事模块
const _LikeAddOrDelete = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/like/addordelete`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _PostsList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/posts/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _PostsDetail = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/posts/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _PostsAddComment = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/posts/addComment`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _PostsGetCommentList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/posts/getCommentList`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _PostsAdd = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/posts/add`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/json",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};





//活动模块
const _ActivitySignUp = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/activity/signUp`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
} 
const _ActivityList = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/activity/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _ActivityDetail = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/activity/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};





//公益模块
const _CommonwealList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/commonweal/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _CommonwealDetail = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/commonweal/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _CommonwealDonation = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/commonweal/warmDonation`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};




//暖课模块
const _WarmclassPay = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/warmclass/pay`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _WarmclassDetail = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/warmclass/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _WarmclassList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/warmclass/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};



const _GetUserInfo = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/user/getUserInfo`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//签到获取积分
const _UserSignin = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/user/signIn`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}
//获取formid
const _SendFormid = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/user/addfromid`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}
//相关登录操作网络流程
const _GetSessionKey = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/auth/getSessionKey`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
          console.log(res.data.msg)
        } else {
          reject(res.data.msg);
        }
      }
    });
  });
};

const _GetSensitiveInfo = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/auth/getSensitiveInfo`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.msg);
        }
      }
    });
  });
};

const _WxappLogin = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/auth/wxappLogin`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } 
         else {
          reject(res.data.msg);
        }
      }
    });
  });
};

const _UploadHeadImg = function () {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/user/uploadHeadImg`,
          data: data,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Nideshop-Token": Token
          },
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}
//短信验证码
const _Smscode = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/user/smscode`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//轮播
const _SpreadList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/index/spreadList`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//收货地址
const _PositionSave = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/address/save`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _PositionList = function() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/address/list`,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _PositionDetail = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/address/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _PositionDelete = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/address/delete`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//下单
const _WeChatPay = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/pay/WeChatPay`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//订单
const _OrderDetail = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _TakeDelay = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/delayOrder`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}
//个人中心订单数量(即最新物流)
const _UserCenterOrderCount = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/orderCount`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _OrderList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _OrderConfirmOrder = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/confirmOrder`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}
const _OrderCancelOrder = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/cancelOrder`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _OrderDeleteOrder = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/deleteOrder`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _OrderSubmit = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/order/submit`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};

const _OrderCheckout = function(data) {
  let url = data ? 
    `${GlobalUrl}api/cart/checkout?couponId=${data.couponId}` :
    `${GlobalUrl}api/cart/checkout`
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//收藏
const _CollectAddorDelete = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/collect/addordelete`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _CollectList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/collect/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//商品
const _CatalogIndex = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/catalog/index`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _CatalogCurrent = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/catalog/current`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _GoodsList = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/goods/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _GoodsDetail = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/goods/detail`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
const _GoodsKeyWordsList = function() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/goods/keyWordsList?id=3`,
      method: "GET",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
//评论
const _CommentList = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/comment/list`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}
const _CommentPost = function(data) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/comment/post`,
          data: data,
          method: "POST",
          header: {
              "Content-Type": "application/json",
            "X-Nideshop-Token": Token
          },
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}
const _OfficialNewsList = function (data) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/official/newsList`,
          data: data,
          method: "POST",
          header: {
              "Content-Type": "application/x-www-form-urlencoded",
            "X-Nideshop-Token": Token
          },
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}
const _CommentCount = function (data) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/comment/count`,
          data: data,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Nideshop-Token": Token
          },
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}
//购物车
const _CartAdd = function (data) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/cart/add`,
          data: data,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Nideshop-Token": Token
          },
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
 
              reject(res.data.errmsg);
            }
          }
        });
    });
}
const _CartChecked = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/cart/checked`,
      data: data,
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}
const _GetCartGoodsCount = function (data) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/cart/goodscount`,
          method: "GET",
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}
const _CartDelete = function (data) {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/cart/delete`,
          data: data,
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Nideshop-Token": Token
          },
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}

const _CartIndex = function () {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/cart/index`,
          header: {
            "X-Nideshop-Token": Token
          },
          method: "GET",
          success: res => {
            if (res.data.errno === 0) {
              resolve(res.data.data);
            } else {
              reject(res.data.errmsg);
            }
          }
        });
    });
}

const _CouponForUser = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/coupon/listForUser`,
      header: {
        "X-Nideshop-Token": Token
      },
      data: data,
      method: "GET",
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}

//商品优惠券
const _CouponForGood = function (data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/coupon/listForGood`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      data: data,
      method: "POST",
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
}

// 领取优惠券
const _CouponAdd = function(data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${GlobalUrl}api/coupon/addUserCoupon`,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Nideshop-Token": Token
      },
      data: data,
      method: "POST",
      success: res => {
        if (res.data.errno === 0) {
          resolve(res.data.data);
        } else {
          reject(res.data.errmsg);
        }
      }
    });
  });
};
module.exports = {
  _CouponForUser,
  _CouponForGood,
  _CouponAdd,
  _AboutChunya,
  _CollectDeleteAll,
  _LikeAddOrDelete,
  _PostsList,
  _PostsDetail,
  _PostsAddComment,
  _PostsGetCommentList,
  _PostsAdd,
  _ActivityList,
  _ActivityDetail,
  _ActivitySignUp,
  _CommonwealDonation,
  _CommonwealDetail,
  _CommonwealList,
  _WarmclassPay,
  _WarmclassList,
  _WarmclassDetail,
  _UserSignin,
  _GetUserInfo,
  _SendFormid,
    _GetSessionKey,
    _GetSensitiveInfo,
    _WxappLogin,
    _SetToken,
    _Smscode,
    _SpreadList,
    _PositionSave,
    _PositionList,
    _PositionDetail,
    _PositionDelete,
    _WeChatPay,
    _OrderConfirmOrder,
    _OrderCancelOrder,
    _OrderDeleteOrder,
    _OrderDetail,
    _OrderList,
    _OrderSubmit,
    _OrderCheckout,
    _TakeDelay,
    _CollectAddorDelete,
    _CollectList,
    _CatalogIndex,
    _CatalogCurrent,
    _GoodsList,
    _GoodsDetail,
    _GoodsKeyWordsList,
    _CommentPost,
    _OfficialNewsList,
    _CommentCount,
  _CommentList,
    _CartAdd,
  _CartChecked,
    _GetCartGoodsCount,
    _CartDelete,
    _CartIndex,
  _UserCenterOrderCount
};
