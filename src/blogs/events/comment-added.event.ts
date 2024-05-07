export class CommentAddedEvent {
  constructor(
    public readonly authorId: number,
    public readonly authorEmail: string,
    public readonly blogId: number,
  ) {}
}
