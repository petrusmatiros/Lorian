interface Event {
    id: string;
    spreadsheet: string;
    channel: string;
    trigger: string;
    message: string;
}

interface Spreadsheet {
    id: string;
    events: Event[];
}

interface Author {
    id: string;
    name: string;
    role: string;
}

interface Guild {
    id: string;
    name: string;
    spreadsheets: Spreadsheet[];
    authors: Author[];
}

export { Event, Spreadsheet, Author, Guild};