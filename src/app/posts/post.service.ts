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

  // ---- GET All ---- //
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

  // ---- GET One ---- //
  getPost(id: string) {
    return this.http.get<Post>('http://localhost:3000/api/posts/' + id);
  }

  // ---- DELETE ---- //
  deletePost(id: string) {
    const postId = this.posts.findIndex(post => post._id === id);

    this.http.delete(`http://localhost:3000/api/posts/` + id).subscribe(
      () => {
        this.posts.splice(postId, 1);
        this.postsChanged.next(this.posts);
      }
    );
  }

  // ---- POST ---- //
  addPost(formTitle: string, formContent: string, formImage: File) {
    // create Form Data
    const postData = new FormData();
    postData.append('title', formTitle);
    postData.append('content', formContent);
    postData.append('image', formImage, formTitle);

    this.http.post<{ message: string, post: Post }>
    ('http://localhost:3000/api/posts', postData)
      .subscribe((resData) => {

        const {_id, title, content, imagePath} = resData.post;

        const savedPost: Post = {
          _id, title, content, imagePath
        };

        this.posts.push(savedPost);
        this.postsChanged.next(this.posts);
        this.router.navigate(['/']);
      });
  }

  // ---- PUT ---- //
  // tslint:disable-next-line:variable-name
  updatePost(_id: string, title: string, content: string, image: File | string) {
    let postData;

    if (typeof (image) === 'object') { // if image was updated
      postData = new FormData();
      postData.append('_id', _id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else { // image was not updated
      postData = {_id, title, content, imagePath: image};
    }
    this.http.put<{ message: string, updatedPost: Post }>(`http://localhost:3000/api/posts/` + _id, postData)
      .subscribe(
        (res) => {
          const postId = this.posts.findIndex(p => p._id === _id);
          const updatedPosts = [...this.posts];
          updatedPosts[postId] = res.updatedPost;
          this.posts = updatedPosts;
          this.postsChanged.next(this.posts);
          this.router.navigate(['/']);
        }
      );
  }
}
