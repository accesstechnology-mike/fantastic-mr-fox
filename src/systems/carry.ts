import type { FarmId, FoodKind } from "../types";
import { STEAL_RULE } from "../data/story";
import { statsOf } from "./party";
import type { CharacterId } from "../types";

export interface CarriedFood {
  id: string;
  kind: FoodKind;
  farm: FarmId;
}

export class CarrySystem {
  bag: CarriedFood[] = [];
  deposited: CarriedFood[] = [];

  capacity(character: CharacterId): number {
    return statsOf(character).carry;
  }

  canTake(character: CharacterId): boolean {
    return this.bag.length < this.capacity(character);
  }

  take(item: CarriedFood, character: CharacterId): boolean {
    if (!this.canTake(character)) {
      return false;
    }
    this.bag.push(item);
    return true;
  }

  dropAll(): CarriedFood[] {
    const dropped = [...this.bag];
    this.bag = [];
    return dropped;
  }

  deposit(): number {
    this.deposited.push(...this.bag);
    const n = this.bag.length;
    this.bag = [];
    return n;
  }

  takenFrom(farm: FarmId): number {
    return [...this.bag, ...this.deposited].filter((item) => item.farm === farm).length;
  }

  tooGreedy(farm: FarmId): boolean {
    return this.takenFrom(farm) > STEAL_RULE.perFarmMax;
  }

  greedRuined(farm: FarmId): boolean {
    return this.takenFrom(farm) >= STEAL_RULE.greedFailAt;
  }

  varietyReady(needEach: number, needTotal: number): boolean {
    const farms: FarmId[] = ["boggis", "bunce", "bean"];
    const each = farms.every((farm) => this.deposited.filter((item) => item.farm === farm).length >= needEach);
    return each && this.deposited.length >= needTotal;
  }
}
