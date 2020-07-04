import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  postsChanged = new Subject<Post[]>();

  constructor(private http: HttpClient) {
  }

  getPosts() {
    this.http.get<{ message: string, posts: Post[] }>
    ('http://localhost:3000/api/posts')
      .subscribe(
        (data) => {
          this.posts = data.posts;
          this.postsChanged.next([...this.posts]);
        }
      );
  }

  addPost(title: string, content: string) {
    const newPost = {_id: null, title, content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', newPost)
      .subscribe((resData) => {
        newPost._id = resData.postId;
        this.posts.push(newPost);
        this.postsChanged.next(this.posts);
      });
  }

  deletePost(id: string) {
    const postId = this.posts.findIndex(post => post._id === id);

    this.http.delete(`http://localhost:3000/api/posts/` + id).subscribe(
      () => {
        this.posts.splice(postId, 1);
        this.postsChanged.next(this.posts);
      }
    );
  }

}
