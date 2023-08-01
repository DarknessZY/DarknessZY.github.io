---
title: 日期小组件的封装
date: 2022-10-12 13:12
tags: [组件封装]
categories: 组件
---
<!-- <meta name="referrer" content="no-referrer" /> -->

# 一、日期小组件

公司有一个微信小程序项目用的是uni-app+uview2,uview2上的那个日期组件并不是产品想要样子，那就只好自己动手查阅资料了，看看别人的日历组件怎么搞的，再根据这些，写写样式，改改逻辑，完成产品需要的喽。不和你多bb，直接上效果图和代码，主要也是自己做个笔记，指不定哪天又用上，到时候c+v就行了，哈哈！

## 1.效果图

<p align=center><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c64a3ea7f6cf4209a321d38af9e11d09~tplv-k3u1fbpfcp-watermark.image?" alt="d8a086257743cc6dee6907df3bcfc63.png"  /></p>

## 2.代码

我一般是这样建文件：components=>term-picker=>term-picker.vue

```
<template>
	<view :class="{'pickerMask':visable}" @click="maskClick" @touchmove.stop.prevent="returnHandle">
		<view class="picker-box" :class="{'picker-show':visable}">
      <view class="selectDate">
        <view class="selectDateTxt">
          <text>选择日期</text>
        </view>
      </view>
      <view class="lineshow">
        <view class="line"></view>
      </view>
			<view class="operate-box" @touchmove.stop.prevent="returnHandle" @tap.stop="returnHandle">

				<view class="time-box">
					<view @click="touchSelect(0)" class="time-item" :style="{color:touchIndex?'#000000':themeColor}">
						<text>{{startText}}</text>
						<text>{{resultDate[0]}}</text>
					</view>
					<text>至</text>
					<view @click="touchSelect(1)" class="time-item" :style="{color:touchIndex?themeColor:'#000000'}">
						<text>{{endText}}</text>
						<text>{{resultDate[1]}}</text>
					</view>
				</view>

			</view>
      <view class="lineshow">
        <view class="line"></view>
      </view>
			<picker-view :value="pickerValue" @change="pickerChange" class="picker-view" :indicator-style="indicatorStyle" @tap.stop="returnHandle">
        <picker-view-column style="flex: 0 0 30.5%">
				    <view class="picker-item" v-for="(item, index) in years" :key="index">{{item}}年</view>
				</picker-view-column>
				<picker-view-column style="flex: 0 0 30.5%">
				    <view class="picker-item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
				</picker-view-column>
				<picker-view-column v-if="days.length > 0" style="flex: 0 0 30.5%">
				    <view class="picker-item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
				</picker-view-column >
			</picker-view>
      <view class="button">
        <view  class="buttonClose" @click="pickerClose">
          <view class="buttonClosetxt">
            取消
          </view>

        </view>
        <view  class="buttonConfirm" @click="pickerConfirm">
          <view class="buttonConfirmtxt">
            确认
          </view>
        </view>
      </view>
		</view>
	</view>
</template>
<script>
export default {
  name: 'termPicker',
  props: {
    visable: {
      type: Boolean,
      default: false
    },
    defaultDate: {
      type: Array,
      default: () => []
    },
    minYear: {
      type: Number,
      default: 2020,
    },
    timeLimit: {
      type: Boolean,
      default: false
    },
    deferYear: {
      type: Number,
      default: 0,
    },
    themeColor: {
      type: String,
      default: '#10BE9D'
    },
    startText: {
      type: String,
      default: '开始时间'
    },
    endText: {
      type: String,
      default: '结束时间'
    }
  },
  data() {
    const date = new Date()
    const years = []
    const year = date.getFullYear()
    const months = []
    const month = date.getMonth() + 1
    const day = date.getDate()
    const maxYear = this.timeLimit ? year : year + this.deferYear
    for (let i = this.minYear;i <= maxYear;i++) {
      years.push(i)
    }
    for (let i = 1;i <= 12;i++) {
      months.push(i)
    }
    return {
      indicatorStyle: 'height: 100rpx;',
      touchIndex: 0,
      year,
      month,
      day,
      years,
      months,
      days: [],
      pickerValue: [],
      resultDate: []
    }
  },
  mounted() {
    this.setDate()
  },
  methods: {
    returnHandle() {},
    setDate() {
      if (this.defaultDate.length) {
        if (this.defaultDate.length > 0) {
          const date = this.defaultDate[0]
          this.resultDate = this.defaultDate
          this.setPicker(date)
        } else {
          const month = this.month < 10 ? '0' + this.month : this.month
          const day = this.day < 10 ? '0' + this.day : this.day
          const nowTime = this.year + '-' + month + '-' + day
          this.resultDate = [nowTime, nowTime]
          this.setPicker(nowTime)
        }
      }
    },
    setPicker(date) {
      if (date) {
        const splitVal = date.split('-')
        const year = this.years.indexOf(Number(splitVal[0]))
        const month = Number(splitVal[1]) - 1
        const day = Number(splitVal[2]) - 1
        this.pickerChange({
          detail: {
            value: [year, month, day]
          }
        })
      }
    },
    touchSelect(val) {
      const date = this.resultDate[val]
      this.touchIndex = val
      this.setPicker(date)
    },
    getDateTime(date) {
      const year = this.years[date[0]]
      let month = this.months[date[1]]
      let day = this.days[date[2]]
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      this.resultDate[this.touchIndex] = year + '-' + month + '-' + day
    },
    pickerChange(e) {
      const currents = e.detail.value
      if (currents[1] + 1 === 2) {
        this.days = []
        if (
          ((currents[0] + this.minYear) % 4 === 0 &&
            (currents[0] + this.minYear) % 100 !== 0) ||
          (currents[0] + this.minYear) % 400 === 0
        ) {
          for (let i = 1;i < 30;i++) {
            this.days.push(i)
          }
        } else {
          for (let i = 1;i < 29;i++) {
            this.days.push(i)
          }
        }
      } else if ([4, 6, 9, 11].some((item) => currents[1] + 1 === item)) {
        this.days = []
        for (let i = 1;i < 31;i++) {
          this.days.push(i)
        }
      } else if (
        [1, 3, 5, 7, 8, 10, 12].some((item) => currents[1] + 1 === item)
      ) {
        this.days = []
        for (let i = 1;i < 32;i++) {
          this.days.push(i)
        }
      }
      this.pickerValue = currents
      this.getDateTime(currents)
    },
    maskClick() {
      this.$emit('update:visable', false)
    },
    pickerClose() {
      console.log('我是取消')
      this.maskClick()
    },
    pickerConfirm() {
      const { resultDate, timeLimit } = this
      const startTime = new Date(resultDate[0]).getTime()
      const endTime = new Date(resultDate[1]).getTime()
      const nowTime = timeLimit ? new Date().getTime() : endTime
      if (startTime <= endTime) {
        if (endTime <= nowTime) {
          this.$emit('confirm', resultDate)
          this.maskClick()
        } else {
          uni.showToast({
            title: '时间不能超过今天',
            icon: 'none'
          })
        }
      } else {
        uni.showToast({
          title: '时间范围不正确！',
          icon: 'none'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pickerMask {
  position: fixed;
  z-index: 998;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.picker-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 998;

  .selectDate {
    width: 100%;
    height: 60rpx;
    padding: 30rpx 30rpx;
    background-color: #fff;
    display: flex;
    align-items: center;

    .selectDateTxt {
      width: 112rpx;
      height: 40rpx;
      font-size: 28rpx;
      font-family: 'PingFangSC-Medium', 'PingFang SC';
      font-weight: 500;
      color: #212034;
      line-height: 40rpx;
    }
  }

  .lineshow {
    display: flex;
    justify-content: center;
    background-color: #fff;

    .line {
      width: 690rpx;
      border: 1rpx solid #f1eff3;
    }
  }

  .operate-box {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18rpx 30rpx;
    background-color: #fff;
    text-align: center;
    font-size: 30rpx;

    .time-box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;

      .time-item {
        display: flex;
        flex-direction: column;
      }
    }
  }

  .button {
    width: 100%;
    background-color: #fff;
    height: 157rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .buttonClose {
      width: 330rpx;
      height: 80rpx;
      border-radius: 40rpx;
      border: 1rpx solid #5368ef;
      transform: rotateZ(360deg);
      display: flex;
      align-items: center;
      justify-content: center;

      .buttonClosetxt {
        width: 60rpx;
        height: 42rpx;
        font-size: 30rpx;
        font-family: 'PingFangSC-Medium', 'PingFang SC';
        font-weight: 400;
        color: #5368ef;
        line-height: 42rpx;
      }
    }

    .buttonConfirm {
      width: 330rpx;
      height: 80rpx;
      background: linear-gradient(159deg, #7486fc 0%, #5368ef 100%);
      border-radius: 35px;
      margin-left: 30rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      .buttonConfirmtxt {
        width: 60rpx;
        height: 42rpx;
        font-size: 30rpx;
        font-family: 'PingFangSC-Medium', 'PingFang SC';
        font-weight: 400;
        color: #fff;
        line-height: 42rpx;
      }
    }
  }
}

.picker-show {
  transform: translateY(0);
}

.picker-view {
  width: 750rpx;
  height: 450rpx;
  background-color: #fff;
  padding-left: 5.5%;

  .picker-item {
    height: 42rpx;
    font-family: 'PingFangSC-Medium', 'PingFang SC';
    font-weight: 400;
    font-size: 30rpx;
    color: #20253b ;
    line-height: 42rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>

```

## 3.使用

在需要这个用到的组件那块导入

> import termPicker from '@/components/term-picker/term-picker.vue'

```
<!-- 日期选择 -->
  <term-picker
	visable.sync="showDateSelect"
	:defaultDate="defaultDate"
	:minYear="1990"
    :timeLimit="true"
    :deferYear="0"
    themeColor="#5368ef"
    @confirm="confirm">
  </term-picker>
 
```

#### Props 参数说明

|   参数名    |  类型   |  默认值  |                             说明                             |
| :---------: | :-----: | :------: | :----------------------------------------------------------: |
|   visable   | Boolean |  false   | 日期选择控件的显示/隐藏，注意使用`.sync`修饰符(true: 显示; false: 隐藏) |
| defaultDate |  Array  |    []    |       默认预设值(比如:`['2021-06-01', '2021-07-01']`)        |
|   minYear   | Number  |   1990   |                           最小年份                           |
|  timeLimit  | Boolean |  false   | 日期区间限制(true: 限制结束日期`<=`当前日期; false: 不限制)  |
|  deferYear  | Number  |    0     | 年份选项顺延数，仅当`timeLimit`为`false`时生效(举个栗子: `deferYear = 1`, 则年份选项的最大值为: `当前年份 + deferYear`) |
| themeColor  | String  | #10BE9D  |                   选择框操作栏部分字体颜色                   |
|  startText  | String  | 开始时间 |                      日期范围起始处文本                      |
|   endText   | String  | 结束时间 |                      日期范围结束处文本                      |

#### Events 事件说明

|  事件名  |              说明              |     返回值      |
| :------: | :----------------------------: | :-------------: |
| @confirm | 点击确定按钮，返回当前选择的值 | `Array`数组类型 |