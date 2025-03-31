interface NodeFetchMetadata<Res> {
  statusCode: number;
  statusText: string;
  response: Res;
}

export class NodeFetchError<Res> extends Error {
  constructor(
    msg: string,
    public readonly metadata: NodeFetchMetadata<Res>,
  ) {
    super(msg);
  }

  get statusCode(): number {
    return this.metadata.statusCode;
  }

  get statusText(): string {
    return this.metadata.statusText;
  }
}
