import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [
    {
      title: 'John Keats',
      content: 'I love you the more in that I believe you had liked me for my own sake and for nothing else.'
    },
    {
      title: 'Amelia Earhart',
      content: 'IThe most difficult thing is the decision to act, the rest is merely tenacity. The fears are paper tigers. You can do anything you decide to do. You can act to change and control your life; and the procedure, the process is its own reward.'
    },
    {
      title: 'Henry James',
      content: 'Do not mind anything that anyone tells you about anyone else. Judge everyone and everything for yourself.'
    },
    {
      title: 'Plato',
      content: 'Wise men speak because they have something to say; Fools because they have to say something.'
    },
    {
      title: 'Thomas Paine',
      content: 'The World is my country, all mankind are my brethren, and to do good is my religion.'
    },
  ];
  postsChanged = new Subject<Post[]>();

  constructor() {
  }

  getPosts() {
    return [...this.posts];
  }

  addPost(title: string, content: string) {
    const newPost = {title, content};
    this.posts.push(newPost);
    this.postsChanged.next(this.posts);
  }

}
