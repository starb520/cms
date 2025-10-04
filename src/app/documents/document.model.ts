export class Document {
    public id: string;
    public name: string;
    public description: string;
    public url: string;
    public children: Document[] | null;

    constructor(id: string, name: string, description: string, url: string, children: Document[] | null=null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.url = url;
        this.children = children; 
    }
}