import { NodeModel } from "storm-react-diagrams";
import { BlogPostPortModel } from "./BlogPostPortModel";

export class BlogPostNodeModel extends NodeModel {
	constructor(name) {
		// console.log('BlogPostNodeModel: ', name)
		super('BlogPost');
		this.addPort(new BlogPostPortModel("top"));
		this.addPort(new BlogPostPortModel("left"));
		this.addPort(new BlogPostPortModel("bottom"));
		this.addPort(new BlogPostPortModel("right"));
	}
}