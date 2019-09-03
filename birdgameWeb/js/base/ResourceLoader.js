import Resource from  './Resource.js';

//加载资源的类

export class ResourceLoader {

    constructor() {
        //资源的数组转化成map
        this.map = new Map(Resource);
        //遍历map创建image对象
        for (let [key, value] of this.map) {
            const image = new Image();
            image.src = value;
            //创建好的image对象放入到map中
            this.map.set(key, image);
        }
        console.log(this.map);

    }

    //浏览器加载完成
    onLoade(callback) {
        let loadCount = 0;
        for (let value of this.map.values()) {
            value.onload = () => {
                loadCount++;
                if (loadCount >= this.map.size){
                    callback(this.map);
                }
            }
        }
    }






}