const GlobalUrl = "https://shop.chunyajkkj.com/ch/";
//
var Token = "";
const _SetToken = function(token) {
  Token = token;
  console.log(Token)
};

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
        } else {
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

//优惠券
const _CouponList = function () {
    return new Promise((resolve, reject) => {
        wx.request({
          url: `${GlobalUrl}api/coupon/list`,
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
module.exports = {
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
    _OrderDetail,
    _OrderList,
    _OrderSubmit,
    _OrderCheckout,
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
    _CartAdd,
    _GetCartGoodsCount,
    _CartDelete,
    _CartIndex,
    _CouponList
};
