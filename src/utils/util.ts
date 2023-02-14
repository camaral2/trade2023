export abstract class util {
  static percent(valueA: number, valueB: number, decimal: number) {
    const calcB = this.numero(valueB * 100, decimal);
    const calcA = this.numero(calcB / valueA, decimal);

    //console.log('calcB:', calcB);
    //console.log('calcA:', calcA);

    return this.numero(calcA - 100, decimal);
  }
  static numero(value: number, decimal: number): number {
    const numTrat = value.toFixed(decimal);
    return Number(numTrat);
  }
}
