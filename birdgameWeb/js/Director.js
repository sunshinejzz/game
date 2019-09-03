//导演类，这个类负责游戏所有逻辑的控制

import { DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";
import {Rectangle} from "./base/Rectangle.js";

export  class Director {
    constructor(){
        this.dataStore = DataStore.getInstance();
    }
    
    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    //创建一对铅笔
    creatPencil(){
        const minTop = window.innerHeight / 8;
        const maxTop = window.innerHeight / 2;
        const top = minTop + (Math.random() * (maxTop - minTop));
        this.dataStore.get('pencils').push(new UpPencil(top));
        this.dataStore.get('pencils').push(new DownPencil(top));
    }

    //判断是否生成一对铅笔
    isCreatPencil(){
        const pencils = this.dataStore.get('pencils');
        //判断第一对铅笔左边缘走过屏幕的一半并且此时铅笔数组中只能有两个
        if((pencils[0].x + pencils[0].width) < (window.innerWidth / 2) && pencils.length == 2){
            this.creatPencil();
        }
    }

    //移除铅笔的逻辑
    outPencil(){
        const pencils = this.dataStore.get('pencils');
        //判断第一对铅笔左边缘走过屏幕的左边并且此时铅笔数组中只能有四个
        if((pencils[0].x + pencils[0].width) < 0 && pencils.length == 4){
            pencils.shift();
            pencils.shift();
            this.dataStore.get('score').isScore = true;
        }
    }

    //小鸟撞击地板的检测方法
    crashLand(){
        let s = false;
        const bird = this.dataStore.get('bird');
        const land = this.dataStore.get('land');
        if (bird.y + bird.offset + bird.height> land.y) {
            s = true;
        }
        return s;
    }

    //判断鸟和铅笔的碰撞
    crashPencil() {
        const pencils = this.dataStore.get('pencils');
        const bird = this.dataStore.get('bird');
        //先创建小鸟的矩形
        const birdRect = new Rectangle(bird.x, bird.y + bird.offset, bird.width, bird.height);
        for(let pencil of pencils){
            const pencilRect = new Rectangle(pencil.x, pencil.y, pencil.width, pencil.height);
            if(birdRect.intersects(pencilRect)){
                return true;
            }
        }
        return false;
    }

    addScoreNumber(){
        const pencils = this.dataStore.get('pencils');
        const bird = this.dataStore.get('bird');
        const score = this.dataStore.get('score');
        //判断鸟越过铅笔
        if(bird.x >= pencils[0].x + pencils[0].width && score.isScore){
            score.scoreNumber++;
            score.isScore = false;
        }
    }

    //游戏运行
    run(){
        if(!this.isGameOver){
            //绘制背景
            this.dataStore.get('background').draw();
            //绘制铅笔
            for (let pencil of this.dataStore.get('pencils')) {
                pencil.draw();
            }
            //绘制陆地
            this.dataStore.get('land').draw();

            this.outPencil();
            //调用判断是否生成铅笔的逻辑
            this.isCreatPencil();
            //画鸟
            this.dataStore.get('bird').draw();
            //加分
            this.addScoreNumber();
            //画分
            this.dataStore.get('score').draw();

            //判断碰撞（陆地，铅笔），结束游戏
            if(this.crashLand()){
                this.isGameOver = true;
            }
            if (this.crashPencil()){
                this.isGameOver = true;
            }

            //定时器
            let timer = requestAnimationFrame(() => {this.run()});
            this.dataStore.put('timer', timer);
        }else {
            cancelAnimationFrame(this.dataStore.get('timer'));
            this.dataStore.get('start').draw();
            this.dataStore.destory();


        }

    }
}