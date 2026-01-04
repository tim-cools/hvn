export enum LeftContainer {
  Explorer,
}

export enum MainContainer {
  View,
  Debugger
}

export class LayoutState {

  public leftContainer: LeftContainer;
  public mainContainer: MainContainer;

  public constructor(leftContainer: LeftContainer,
                     mainContainer: MainContainer) {
    this.leftContainer = leftContainer;
    this.mainContainer = mainContainer;
  }

  public static defaultState(): LayoutState {
    return new LayoutState(LeftContainer.Explorer, MainContainer.View);
  }

  public setLeftContainer(value: LeftContainer): LayoutState {
    return new LayoutState(value, this.mainContainer);
  }

  public setMainContainer(value: MainContainer): LayoutState {
    return new LayoutState(this.leftContainer, value);
  }
}