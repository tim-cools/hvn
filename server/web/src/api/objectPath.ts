import {addRange, take} from "../infrastructure/arrayFunctions";
import {isNullOrEmpty} from "../infrastructure/validationFunctions";

export class ObjectPath {

  public readonly path: string[];

  public get rootIdentifier(): string {
    return this.path[0];
  }

  public get hasChildIdentifiers(): boolean {
    return this.path.length > 1;
  }

  public get parts(): number {
    return this.path.length;
  }

  constructor(identifierPath: string[]) {
    this.path = identifierPath;
  }

  public fullPath(): string {
    return this.path.join('.');
  }

  public lastPart(): string {
    return this.path[this.path.length - 1];
  }

  public toString(): string {
    return this.fullPath();
  }

  public childrenReference(): ObjectPath {
    const parts = this.path.slice(1);
    return new ObjectPath(parts);
  }

  append(parts: Array<string>): ObjectPath {
    const newPath = [...this.path, ...parts];
    return new ObjectPath(newPath);
  }

  public withoutLastPart(): ObjectPath {
    if (this.parts <= 1) throw new Error("Parts <= 1");

    return new ObjectPath(take(this.path, this.parts - 1));
  }

  public static parse(parts: string[]): ObjectPath {
    if (!parts) throw new Error("Invalid empty identifier reference.")
    const allParts = new Array<string>();
    addRange(parts, allParts, this.splitBySeparator);
    return new ObjectPath(parts);
  }

  static parseString(path: string): ObjectPath {
    if (isNullOrEmpty(path)) throw new Error("Invalid empty identifier reference.")
    const parts = this.splitBySeparator(path);
    return new ObjectPath(parts);
  }

  private static splitBySeparator(path: string) {
    return path.split(" ");
  }
}