import {Injectable} from '@angular/core';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  postsChanged = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {
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

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + id);
  }

  addPost(title: string, content: string) {
    const newPost = {_id: null, title, content};
    this.http.post<{ message: string, postId: string }>('http://localhost:3000/api/posts', newPost)
      .subscribe((resData) => {
        newPost._id = resData.postId;
        this.posts.push(newPost);
        this.postsChanged.next(this.posts);
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post = {_id: id, title, content};
    this.http.put<{ message: string }>(`http://localhost:3000/api/posts/` + id, post)
      .subscribe(
        (resData) => {
          const updatedPost = [...this.posts];
          const postId = this.posts.findIndex(p => p._id === id);
          updatedPost[postId] = post;
          this.posts = updatedPost;
          this.postsChanged.next(this.posts);
          this.router.navigate(['/']);
        }
      );
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
