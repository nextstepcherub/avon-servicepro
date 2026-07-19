export class QueryBuilder {
  private _table: string = '';
  private _selectColumns: string[] = ['*'];
  private _whereClauses: string[] = [];
  private _params: any[] = [];
  private _joins: string[] = [];
  private _orderBy: string[] = [];
  private _limit: number | null = null;
  private _offset: number | null = null;

  static table(name: string): QueryBuilder {
    const builder = new QueryBuilder();
    builder._table = name;
    return builder;
  }

  select(...columns: string[]): this {
    if (columns.length > 0) {
      this._selectColumns = columns;
    }
    return this;
  }

  join(joinClause: string): this {
    this._joins.push(joinClause);
    return this;
  }

  where(clause: string, ...params: any[]): this {
    this._whereClauses.push(clause);
    this._params.push(...params);
    return this;
  }

  whereEquals(field: string, value: any): this {
    if (value !== undefined && value !== null) {
      this._whereClauses.push(`${field} = ?`);
      this._params.push(value);
    }
    return this;
  }

  whereLike(field: string, value: string): this {
    if (value) {
      this._whereClauses.push(`${field} LIKE ?`);
      this._params.push(`%${value}%`);
    }
    return this;
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC'): this {
    this._orderBy.push(`${field} ${direction}`);
    return this;
  }

  limit(value: number): this {
    this._limit = value;
    return this;
  }

  offset(value: number): this {
    this._offset = value;
    return this;
  }

  build(): { sql: string; params: any[] } {
    if (!this._table) {
      throw new Error('Table name is required to build a query.');
    }

    let sql = `SELECT ${this._selectColumns.join(', ')} FROM ${this._table}`;

    if (this._joins.length > 0) {
      sql += ' ' + this._joins.join(' ');
    }

    if (this._whereClauses.length > 0) {
      sql += ` WHERE ${this._whereClauses.join(' AND ')}`;
    }

    if (this._orderBy.length > 0) {
      sql += ` ORDER BY ${this._orderBy.join(', ')}`;
    }

    if (this._limit !== null) {
      sql += ` LIMIT ?`;
      this._params.push(this._limit);
    }

    if (this._offset !== null) {
      sql += ` OFFSET ?`;
      this._params.push(this._offset);
    }

    return {
      sql,
      params: this._params,
    };
  }

  buildCount(): { sql: string; params: any[] } {
    if (!this._table) {
      throw new Error('Table name is required to build a count query.');
    }

    let sql = `SELECT COUNT(*) as total FROM ${this._table}`;

    if (this._joins.length > 0) {
      sql += ' ' + this._joins.join(' ');
    }

    if (this._whereClauses.length > 0) {
      sql += ` WHERE ${this._whereClauses.join(' AND ')}`;
    }

    // Slice off limit/offset params as count query does not append limit/offset parameters at the end
    const nonPagingParamCount = this._params.length - (this._limit !== null ? 1 : 0) - (this._offset !== null ? 1 : 0);
    const countParams = this._params.slice(0, nonPagingParamCount);

    return {
      sql,
      params: countParams,
    };
  }
}
export default QueryBuilder;
