
export class NoteData {
  constructor(public noteId?: string, public noteName?: string, public noteInfo?: string) {}
}

export class Node {
  constructor(public partyId?: string, public noteData?: NoteData) {}
}
