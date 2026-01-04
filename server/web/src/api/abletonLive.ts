import {ObjectPath} from "./objectPath";
import {singleOrDefault} from "../infrastructure/arrayFunctions";

type GetChildrenResponse ={
  [key: string]: GetChildrenResponse | string,
}

export class LiveObjects {
  public root: LiveObject;

  constructor() {
    this.root = new LiveObject("root", new ObjectPath([]));
  }

  process(value: GetChildrenResponse): LiveObjects {
    console.log(JSON.stringify(value, null, 4));
    for (const valueKey in value) {
      const node = this.getNode(valueKey);
      node.process(value[valueKey] as GetChildrenResponse);
    }
    return this;
  }

  private getNode(path: string): LiveObject {
    if (path == "") {
      return this.root;
    }
    throw new Error("Invalid live object path: " + path);
  }
}

export class LiveObject {
  public name: string;
  public type: string;
  public path: ObjectPath;
  public children: LiveObject[];
  public childrenLoaded: boolean;

  constructor(name: string, path: ObjectPath) {
    this.name = name;
    this.type = "";
    this.path = path;
    this.childrenLoaded = false;
    this.children = [];
  }

  get(name: string) {
    return singleOrDefault(this.children, child => child.name == name);
  }

  process(valueElement: GetChildrenResponse) {
    for (const key in valueElement) {
      if (key == "___type") {
        const type = valueElement[key] as string;
        if (this.type != type) {
          this.type = type;
        }
        continue;
      }

      this.childrenLoaded = true;

      let existing = this.get(key);
      if (existing == null) {
        existing = new LiveObject(key, this.path.append([key]));
        this.children.push(existing);
      }

      const value = valueElement[key] as GetChildrenResponse;
      existing.process(value);
    }
  }
}