export class Salary {
  constructor(
    public amount: number = 0,
    public period: string = 'month',
  ) { }

  fromString(str: any) {
    if (typeof str === 'string') {
      str = JSON.parse(str);
    }
    this.amount = str.amount;
    this.period = str.period;
    return this;
  }

  getPeriodString(str: string) {
    switch (str) {
      case 'month':
        return 'pro Monat';
      case 'hour':
        return 'pro Stunde';
      case 'job':
        return 'für den ganzen Job';
      case 'other':
        return 'sonstige Basis (siehe Beschreibung)';
    }
  }

  toString(): string {
    return '{"amount":' + this.amount + ',"period":"' + this.period + '"}';
  }
}
