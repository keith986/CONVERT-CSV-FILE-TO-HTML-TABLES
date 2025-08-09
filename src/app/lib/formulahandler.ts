export class FormulaHandler {
  private data: Record<string, any>[];
  private cache: Map<string, any> = new Map();

  constructor(data: Record<string, any>[]) {
    this.data = data;
  }

  evaluateFormula(formula: string, rowIndex: number): number | string {
    try {
      if (!formula.startsWith('=')) return formula;

      const expression = formula.substring(1).toUpperCase();
      
      // Handle SUM with column identifier (e.g., =SUM(A) or =SUM(A:A))
      if (expression.startsWith('SUM')) {
        // Handle single column sum with different formats
        if (expression.includes(':')) {
          // Format =SUM(A:A)
          const colMatch = expression.match(/SUM\(([A-Z]+):([A-Z]+)\)/i);
          if (colMatch) {
            return this.calculateColumnSum(colMatch[1]);
          }
        } else {
          // Format =SUM(A)
          const colMatch = expression.match(/SUM\(([A-Z]+)\)/i);
          if (colMatch) {
            return this.calculateColumnSum(colMatch[1]);
          }
        }
      }

      // Handle range sums (e.g., A1:A5)
      if (expression.includes(':')) {
        return this.calculateRangeSum(expression);
      }

      // Handle basic arithmetic
      const evaluatedExpression = this.replaceReferences(expression);
      return eval(evaluatedExpression);

    } catch (error) {
      console.error('Formula evaluation error:', error);
      return '#ERROR!';
    }
  }

  private calculateColumnSum(column: string): number {
    const colIndex = this.getColIndex(column);
    let sum = 0;

    for (let row = 0; row < this.data.length; row++) {
      if (this.data[row]) {
        const value = Number(Object.values(this.data[row])[colIndex]);
        if (!isNaN(value)) {
          sum += value;
        }
      }
    }
    return sum;
  }

  private calculateRangeSum(expression: string): number {
    const rangeMatch = expression.match(/([A-Z]+\d+):([A-Z]+\d+)/);
    if (!rangeMatch) return 0;

    const [_, start, end] = rangeMatch;
    const startCol = this.getColIndex(start.match(/[A-Z]+/)![0]);
    const startRow = parseInt(start.match(/\d+/)![0]) - 1;
    const endCol = this.getColIndex(end.match(/[A-Z]+/)![0]);
    const endRow = parseInt(end.match(/\d+/)![0]) - 1;

    let sum = 0;
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        if (this.data[row]) {
          const value = Number(Object.values(this.data[row])[col]);
          if (!isNaN(value)) {
            sum += value;
          }
        }
      }
    }
    return sum;
  }

  private getColIndex(col: string): number {
    return col.split('').reduce((acc, char) => 
      acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  }

  private replaceReferences(expression: string): string {
    return expression.replace(/[A-Z]+\d+/g, (match) => {
      const col = match.match(/[A-Z]+/)![0];
      const row = parseInt(match.match(/\d+/)![0]) - 1;
      const colIndex = this.getColIndex(col);
      
      if (this.data[row]) {
        const value = Object.values(this.data[row])[colIndex];
        return isNaN(Number(value)) ? '0' : value.toString();
      }
      return '0';
    });
  }
}