/**
 * Created by seven on 15/7/11.
 */



function Iter() {
    if (!(this instanceof Iter)) return new Iter();
    this.container = [];
    this.current = 0;


    for (var i = 0; i < 5; ++i) {
        this.container.push(Math.random());
    }
    //console.log(this.container);
};
Iter.prototype.iterator=function(){
    this.current = 0;
}

Iter.prototype.next = function () {
console.log("next");
    if (this.current >= this.container.length)
        throw StopIteration;
    else
        return this.container[this.current++];
};
Iter.prototype.hasNext=function(){
    return this.current < this.container.length;
}




var aa = new Iter();
console.log(aa);
var c=0;
aa.iterator();
while (aa.hasNext()) {
    console.log("for:"+aa.next());
    ++c;
}
console.log("Total: "+c);
aa.iterator();
while (aa.hasNext()) {
    console.log("for:"+aa.next());
    ++c;
}