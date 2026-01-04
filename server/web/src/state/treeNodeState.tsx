import {ObjectPath} from "../api/objectPath";

export class TreeNodeState {

  private readonly state: { [key: string]: boolean }

  public constructor(state: { [key: string]: boolean } | null = null) {
    this.state = state !== null ? state : {};
  }

  public isOpen(path: ObjectPath): boolean {
    const value = this.state[path.fullPath()];
    return !!value;
  }

  public setOpen(path: ObjectPath, open: boolean): TreeNodeState {
    const newState = {
      ...this.state,
      [path.fullPath()]: open
    }
    return new TreeNodeState(newState);
  }

  public reset(): TreeNodeState {
    return new TreeNodeState();
  }
}