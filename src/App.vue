<template>
  <div class="smart-car-dashboard">
    <div class="common-layout">
      <el-container>
        <el-aside width="200px">
          <el-button @click="findConnection()" plain type="primary" style="width: 200px;">寻找连接</el-button>
          <div class="work-mode">
            <el-text size="large">工作模式</el-text>
            <div class="mode-buttons">
              <el-button  round v-for="(mode, index) in workModes" :key="index" @click="setMode(mode.id)">
                {{mode.name }}</el-button>
            </div>
          </div>


          <div class="infrared-sensors">
            <div>
              <el-container>
                <el-header><el-text size="large">红外巡线传感器</el-text></el-header>
                <el-main class="el-main">
                  <div class="sensors">
                    <div class="sensor" v-for="sensor in infraredSensors" :key="sensor.id">
                      <img v-if="sensor.active" alt="Vue logo" src="./assets/蓝色小圆球.png">
                      <img v-else src="./assets/黑色小圆球.png"> 
                    </div>
                  </div>
                </el-main>
              </el-container>
            </div>
          </div>

          <div class="work-mode">
            <el-text size="large">当前工作模式 : </el-text>
            <br>
            <el-text v-if="nowMode!=null">  {{ workModes[nowMode].name }}</el-text>
            <div class="mode-buttons">
              
            </div>
          </div>


        </el-aside>
        <el-main>
          <div class="ultrasonic-sensors">
            <h3>超声波测距</h3>
            <div class="form-group">
              <span>{{ ultrasonicData.actualDistance/10 }} cm</span>
            </div>
            <div class="form-group">
              <label>跟随距离 (cm)</label>
              <el-input @change="setWave(ultrasonicData.followDistance)" v-model="ultrasonicData.followDistance" style="width: 240px" placeholder="请输入跟随距离" />
            </div>
          </div>

          <div class="control-panel">
            <h3>软件遥控面板</h3>
            <div class="controls">
              <el-button @click="control('@Q')" style="scale: 100%;"><img class="arrow" src="./assets/左旋.png"></el-button>
              <el-button @click="control('@W')" style="scale: 100%;"><img class="arrow" src="./assets/向上.png"></el-button>
              <el-button @click="control('@E')" style="scale: 100%;"><img class="arrow" src="./assets/右旋.png"></el-button>
              <div>
                <el-button @click="control('@A')" style="scale: 100%;"><img class="arrow"
                    src="./assets/向左.png"></el-button>
                <el-button @click="control('@STOP')" style="scale: 100%;"><img class="arrow"
                    src="./assets/停止.png"></el-button>
                <el-button @click="control('@D')" style="scale: 100%;"><img class="arrow"
                    src="./assets/向右.png"></el-button>
              </div>
              <el-button @click="control('@STOP')" style="scale: 100%;"><img class="arrow" src="./assets/停止.png">
              </el-button>
              <el-button @click="control('@S')" style="scale: 100%;"><img class="arrow"
                  src="./assets/向下.png"></el-button>
              <el-button @click="control('@STOP')" style="scale: 100%;"><img class="arrow"
                  src="./assets/停止.png"></el-button>
            </div>
          </div>

          <div class="motor-status">
            <h3>电机状态</h3>
            <div v-for="motor in motors" :key="motor.id" class="motor">
              <label>{{ motor.name }}</label>
              <label>油门</label>
              <input type="range" v-model="motor.speed" min="0" max="232" disabled="false" />
            </div>
          </div>
        </el-main>
      </el-container>
    </div>


  </div>
</template>

<script lang="ts">
/// <reference types="web-bluetooth" />
import axios from 'axios';
import { tr } from 'element-plus/es/locale';
import { defineComponent, computed ,reactive,onMounted, ref } from 'vue';

export default defineComponent({
  name: 'SmartCarDashboard',
  setup() {
    const mode = ref()

    const workModes = [
      { name: '手柄遥控' ,id:0 },
      { name: '软件遥控' ,id:1},
      { name: '自主巡线' ,id:2},
      { name: '巡线跟随' ,id:3},
    ];

    const infraredSensors = reactive([
      { id: 1, name: '1号', status: '白色', active: true },
      { id: 2, name: '2号', status: '白色', active: true },
      { id: 3, name: '3号', status: '白色', active: true },
      { id: 4, name: '4号', status: '白色', active: true },
    ]);

    const ultrasonicData = reactive({
      actualDistance: 0,
      followDistance: 20,
    });

    const motors = reactive([
      { id: 1, name: '1号电机', direction: 'forward', speed: 0 },
      { id: 2, name: '2号电机', direction: 'forward', speed: 0 },
      { id: 3, name: '3号电机', direction: 'forward', speed: 0 },
      { id: 4, name: '4号电机', direction: 'forward', speed: 0 },
    ]);

    const FillParseData = () =>{
      if(parseData.value[1] == 0){
        infraredSensors[0].active = true
      }else{
        infraredSensors[0].active = false
      }
      if(parseData.value[2] == 0){
        infraredSensors[1].active = true
      }else{
        infraredSensors[1].active = false
      }
      if(parseData.value[3] == 0){
        infraredSensors[2].active = true
      }else{
        infraredSensors[2].active = false
      }
      if(parseData.value[4] == 0){
        infraredSensors[3].active = true
      }else{
        infraredSensors[3].active = false
      }

      motors[0].speed = parseData.value[6]
      motors[1].speed = parseData.value[7]
      motors[2].speed = parseData.value[8]
      motors[3].speed = parseData.value[9]

      ultrasonicData.actualDistance = parseData.value[5]

    }

    onMounted(() => {
        window.setInterval(receive, 1000); // 每隔1秒执行一次
    });


    const findConnection = async () =>{
    await axios.get('http://localhost:8090/connect',{
        params:[

        ]
      }).then((res) =>{
        console.log(res)
      })
    }
  
     const control = (direction: string) => {
        axios.get('http://localhost:8090/move',{
          params:{
            order:direction
          }
          
        }).then((res)=>{
          console.log(res)
        })
    };
    const receiveData = ref()
    const parseData =ref()
    const receive = () => {
      axios.get('http://localhost:8090/receive',{
    
        }).then((res)=>{
          receiveData.value = res.data
          parseData.value = receiveData.value.split(" ").map(Number)
          FillParseData()
        })
    }
    
    const setWave = (wave:number) =>{
      axios.get('http://localhost:8090/move',{
          params:{
            order:'#'+wave
          }
        }).then((res)=>{
          console.log(res)
        })
    }
    const nowMode = ref();
    const setMode = (mode:number) =>{
      axios.get('http://localhost:8090/move',{
          params:{
            order:'!'+mode
          }
          
        }).then((res)=>{
          nowMode.value = mode
          console.log(res)
        })
    }
 
    return {
      workModes,
      infraredSensors,
      ultrasonicData,
      motors,
      receiveData,
      parseData,
      nowMode,
      setWave,
      receive,
      findConnection,
      control,
      setMode,
    };
  },
});
</script>

<style scoped>
.arrow {
  scale: 30%;
  width: 50px;
  height: 50px;
}


.smart-car-dashboard {
  padding: 20px;
  background: radial-gradient(circle, #ffffff, #727272);
}

.tcp-server-settings,
.work-mode,
.ultrasonic-sensors,
.motor-status,
.control-panel {
  margin-top: 0%;
  text-align: center;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #000000;
  border-radius: 8px;
  background: #ffffff8c;
}

.infrared-sensors {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #000000;
  border-radius: 8px;
  background: #ffffff8c;
  height: 150px;
}


.form-group {
  margin-bottom: 15px;
}

.mode-buttons {
  display: grid;
}

.mode-buttons button {

  margin-bottom: 10px;
}

.el-main {
  padding-top: 0%;
}

.sensors {
  display: flex;
  text-align: left;
  padding-top: 0%;
}


.sensors .sensor {
  padding-top: 0%;
  scale: 30%;
  width: 25px;
}

.motor {
  margin-bottom: 15px;
}

.controls button {
  margin: 5px;
}

@media (max-width: 768px) {

  .tcp-server-settings,
  .work-mode,
  .infrared-sensors,
  .ultrasonic-sensors,
  .motor-status,
  .control-panel {
    margin-bottom: 15px;
  }
}
</style>
