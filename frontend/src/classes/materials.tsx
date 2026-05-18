export class Material{
    static materials:{} = {};
    url:string;
    name:string;
    constructor(url:string,name:string){
        this.url =url;
        this.name=name;
        Material.materials[name] = this;
    }
    rename(name:string){
        Material.materials[name]=this;
        Material.materials[this.name]=null;
        delete Material.materials[this.name];
        this.name=name
    }
    setUrl(url:string){
        this.url=url
    }
}