// pages/test/test.js
const app = getApp()
import { _PositionList, _PositionSave } from '../../utils/request'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    myAddressList: [],
    a: "abc",
    defaultAddress: false,
    inputData: {
      userName: "",
      provinceName: "",
      cityName: "",
      countyName: "",
      detailInfo: "",
      telNumber: "",
      is_default: false
    }
  },
  onReady() {
    app.setWatcher(this.data, this.watch);
    this.setData({
      a: "nimeide"
    });
    _PositionList().then(data => {
      this.setData({
        myAddressList: data
      });
    });
  },
  defaultAddress(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.is_default = res.detail.value;
      this.setData({ inputData: obj });
      console.log(this.data.inputData);
    }, 500);
  },
  inpUser(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.userName = res.detail.value;
      this.setData({
        inputData: obj
      });
    }, 500);
  },
  inpProvince(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.provinceName = res.detail.value;
      this.setData({ inputData: obj });
    }, 500);
  },
  inpCity(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.cityName = res.detail.value;
      this.setData({ inputData: obj });
    }, 500);
  },
  inpDistrict(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.countyName = res.detail.value;
      this.setData({ inputData: obj });
    }, 500);
  },
  inpAddrDetail(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.detailInfo = res.detail.value;
      this.setData({ inputData: obj });
    }, 500);
  },
  inpPhoneNum(res) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let obj = this.data.inputData;
      obj.telNumber = res.detail.value;
      this.setData({ inputData: obj });
    }, 500);
  },
  inputConfirm() {
    let flag = true;
    let inputData = this.data.inputData;
    for (let key in inputData) {
      inputData[key] === '' ? (flag = false) : "";
    }
    if (flag) {
      _PositionSave(inputData).then(data => {
        let arr = [...this.data.myAddressList, ...[data]]
        this.setData({
          myAddressList: arr
        })
        console.log(this.data.myAddressList)
      });
    }
  },
  watch: {
    myAddressList(newValue) {
      console.log(newValue);
    }
  }
});