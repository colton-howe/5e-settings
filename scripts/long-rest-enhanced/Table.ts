interface ColumnDef {
    span?: number;
    width?: string;
}

class Table<T> {

    private rows: T[];

    private columns: ColumnDef[];

    private constructor(private rowBuilder: (item: T) => string, private headerBuilder: () => string) {
        this.rows = [];
        this.columns = [];
    }

    static builder<T>(rowBuilder: (item: T) => string, headerBuilder: () => string = () => "") {
        return new Table<T>(rowBuilder, headerBuilder);
    }

    addColumn(def: ColumnDef): Table<T> {
        this.columns.push(def);
        return this;
    }

    addRow(item: T) {
        this.rows.push(item);
    }

    build(): string {
        return `<table><thead>${this.headerBuilder()}</thead><tbody>${this.rows.map(item => this.rowBuilder(item)).join("")}</tbody></table>`;
    }
}

export default Table;