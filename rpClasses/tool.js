
class Tool {
    name;
    durability;
    damage;
    speed;
    target;
    valuePD;
    value = () => this.valuePD*this.durability;

    constructor(name, durability, damage, speed, target, value){
        this.name = name;
        this.durability = durability;
        this.damage = damage;
        this.speed = speed;
        this.target = target;
        this.valuePD = value/durability;
    }

    use(targetObject) {
        if (this.durability*this.damage >= targetObject.health) {
            this.durability -= Math.round(targetObject.health/this.damage);
            return null;
        }else{
            targetObject.health -= this.durability*this.damage;
            return targetObject;
        }
    }
}

module.exports = {
    Tool
}

