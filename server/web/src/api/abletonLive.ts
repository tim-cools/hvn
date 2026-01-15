import {ObjectPath} from "./objectPath";
import {singleOrDefault} from "../infrastructure/arrayFunctions";
import React from "react";
import {TreeNodeState} from "../state/treeNodeState";

type GetChildrenResponse ={
  [key: string]: GetChildrenResponse | string,
}

type GetInfoResponse ={
  path: string,
  id: string,
  type: string,
  description: string,
  children: {child: string, type: string}[],
  properties: {property: string, type: string}[],
  functions: string[]
}

export type LiveFunction = string;

export type LiveProperty = {
  readonly property: string,
  readonly type: string,
}

export type LiveChild = {
  readonly child: string,
  readonly type: string,
}

export class LiveObjects {
  public root: LiveObject;

  constructor() {
    this.root = new LiveObject("root", new ObjectPath([]));
  }

  process(value: GetChildrenResponse, setTreeState: React.Dispatch<React.SetStateAction<TreeNodeState>> | null = null): LiveObjects {
    console.log(JSON.stringify(value, null, 4));
    for (const valueKey in value) {
      const node = this.getNode(valueKey, setTreeState);
      node.process(value[valueKey] as GetChildrenResponse, setTreeState);
    }
    return this;
  }

  processInfo(value: GetInfoResponse, setTreeState: React.Dispatch<React.SetStateAction<TreeNodeState>> | null = null): LiveObjects {
    const path = new ObjectPath(value.path.split(" "));
    const node = this.getNode(value.path, setTreeState)

    node.processInfo(value);

    return this;
  }

  private getNode(path: string, setTreeState: React.Dispatch<React.SetStateAction<TreeNodeState>> | null = null): LiveObject {

    if (path == "") {
      return this.root;
    }

    let currentObject = this.root;
    let parts = path.split(" ");
    for (let index = 0 ; index < parts.length ; index++) {
      let child = currentObject.get(parts[index]);
      if (child == null) {
        throw new Error("Couldn't find object '" + parts[index] + "' of path '" + path);
      }
      currentObject = child;
    }

    if (setTreeState) {
      setTreeState(state => state
        .setOpen(ObjectPath.parseString(path), true)
        .setLoading(ObjectPath.parseString(path), false));
    }

    return currentObject;
  }
}

export class LiveObject {
  public name: string;
  public type: string;
  public path: ObjectPath;
  public children: LiveObject[];
  public childrenNotLoaded: boolean;
  public infoLoaded: boolean;
  public properties: LiveProperty[];
  public functions: LiveFunction[];

  constructor(name: string, path: ObjectPath) {
    this.name = name;
    this.type = "";
    this.path = path;
    this.childrenNotLoaded = false;
    this.infoLoaded = false;
    this.children = [];
    this.properties = [];
    this.functions = [];
  }

  get(name: string) {
    return singleOrDefault(this.children, child => child.name == name);
  }

  process(valueElement: GetChildrenResponse, setTreeState: React.Dispatch<React.SetStateAction<TreeNodeState>> | null = null) {
    for (const key in valueElement) {
      if (key == "___type") {
        this.type = valueElement[key] as string;
        continue;
      }

      if (key == "___childrenNotLoaded") {
        if (!this.childrenNotLoaded) {
          this.childrenNotLoaded = true;
        }
        continue;
      }

      this.childrenNotLoaded = false;
      if (setTreeState) {
        setTreeState(state => state.setLoading(this.path, false));
      }

      let existing = this.get(key);
      if (existing == null) {
        existing = new LiveObject(key, this.path.append([key]));
        this.children.push(existing);
      }

      const value = valueElement[key] as GetChildrenResponse;
      existing.process(value);
    }
  }

  processInfo(value: GetInfoResponse) {
    this.properties = value.properties;
    this.functions = value.functions;
  }
}
