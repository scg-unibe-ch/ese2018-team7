/**
 * Simple class for storing salary information about a job posting
 */
export class Salary {

  /**
   * Initialises a new salary object with the provided values for amount and period
   * @param amount Amount of money paid per period
   * @param period Length of period, possible values: month, hour, job, other
   */
  constructor(
    public amount: number = 0,
    public period: string = 'month',
  ) { }

  /**
   * Initialises the properties with data provided as a JSON string
   * @param stringData JSON formatted string containing salary data
   */
  fromString(stringData: any) {
    if (typeof stringData === 'string') {
      stringData = JSON.parse(stringData);
    }
    this.amount = stringData.amount;
    this.period = stringData.period;
    return this;
  }

  /**
   * Returns the full period string of this salary object
   * @param shortString Short string to be converted into the full string
   * @returns Full string representation of salary period
   */
  getPeriodString(shortString: string) {
    switch (shortString) {
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

  /**
   * Returns a string representation of the Salary object
   * @returns String representation of this object
   */
  toString(): string {
    return '{"amount":' + this.amount + ',"period":"' + this.period + '"}';
  }

}
