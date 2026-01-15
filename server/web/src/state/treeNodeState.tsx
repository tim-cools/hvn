import {ObjectPath} from "../api/objectPath";

export class TreeNodeState {

  private readonly stateOpen: { [key: string]: boolean }
  private readonly stateLoading: { [key: string]: boolean }

  public constructor(stateOpen: { [key: string]: boolean } | null = null, stateLoading: { [key: string]: boolean } | null = null) {
    this.stateOpen = stateOpen !== null ? stateOpen : {};
    this.stateLoading = stateLoading !== null ? stateLoading : {};
  }

  public isOpen(path: ObjectPath): boolean {
    const value = this.stateOpen[path.fullPath()];
    return !!value;
  }

  public setOpen(path: ObjectPath, open: boolean): TreeNodeState {
    const newState = {
      ...this.stateOpen,
      [path.fullPath()]: open
    }
    return new TreeNodeState(newState, this.stateLoading);
  }

  public isLoading(path: ObjectPath): boolean {
    const value = this.stateLoading[path.fullPath()];
    return !!value;
  }

  public setLoading(path: ObjectPath, open: boolean): TreeNodeState {
    const newState = {
      ...this.stateLoading,
      [path.fullPath()]: open
    }
    return new TreeNodeState(this.stateOpen, newState);
  }

  public reset(): TreeNodeState {
    return new TreeNodeState();
  }
}