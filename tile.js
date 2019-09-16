// Generic tile class

class Tile{
    constructor(x,y,type){
        this.x = x;
        this.y = y;
        this.type = type;
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.parent = null
    }

    isWall = () => {
        return this.type === "wall";
    }
}